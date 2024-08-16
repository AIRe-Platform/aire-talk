// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.


import { scrollChatToBottom } from "@/helpers/scrollToMessage";
import { ChatMessage, ChatState, ChatStats } from "@/models/chat";
import { Topic } from "@/models/topic";
import {
    AireServices,
    AireTalkEvent,
    AireChatLog,
    AireStatus,
} from "aire";
import { reactive } from "vue";
import {
    createErrorMessage,
    createSystemMessage,
    createUserMessage,
    mapMessage,
    createAssistantMessage,
    createContentMessage
} from "@/helpers/chatMessages";
import useChatbot from "./chatbot";
import { useChatCache } from "./cache";
import useQuestionnaire from "./questionnaire";
import useSummary from "./summary";
import i18n, { l } from "@/locales";
import { getChatbotInputData } from "@/helpers/chatUtils";
import useLogin from "./login";
import useContent from "./content";
import { createQuestionnaire, queryQuestionnaire } from "@/helpers/questionnaireUtils";
import { getChatContentIds } from "@/helpers/contentUtils";

export class ChatContext {
    id?: string;
    autosave_timer?: number;
    modified: boolean;

    public messages: Array<ChatMessage>;
    public stats: ChatStats;
    public meta: {
        age?: number;
        occupation?: string;
        topic?: Topic;
    };

    constructor() {
        this.messages = [];
        this.stats = {};
        this.meta = {};
        this.modified = false;
    }

    /** Resets the chat state */
    public async reset(skip_save: boolean = false, clear_cache = false) {
        this.resetAutoSave()

        if (!skip_save) {
            await this.save()
        }

        if (clear_cache) {
            const cache = useChatCache();
            cache.clear();
        }

        this.id = undefined;
        this.messages = [];
        this.meta = {};
        this.modified = false;
        this.stats = {};

        useQuestionnaire().reset();
        useSummary().reset();

        const system_message = createSystemMessage(l.system_greeting);
        this.push(system_message);
    }

    /** 
     * Reset current chat with a new one
     */
    public async startNew(topic?: Topic) {
        await this.reset(false, false);
        if (topic) {
            this.meta.topic = topic;
            const topic_msg = i18n.global.t(l.system_topic);
            const topic_name = i18n.global.t(topic.localization_key);
            const msg = createSystemMessage(`${topic_msg}${topic_name}`, false);
            this.push(msg);
        }
    }

    /**
     * Add new user message and wait response from the chatbot
     * @param message Message content
     */
    public send(message: string) {
        const msg = createUserMessage(message);
        this.push(msg);
        streamResponse();
    }

    /**
     * Push a new message
     * @param message Message
     * @param create Set to false if you want to modify the last message
     * @param final Set to false to delay triggering auto save
     */
    public push(message: ChatMessage, create: boolean = true, final: boolean = true) {
        if (create) {
            this.messages.push(message);
        } else {
            this.messages[this.messages.length - 1] = message;
        }

        if (final && message.role !== "system") {
            this.autoSave();
        }

        scrollChatToBottom();
    }

    /**
     * Reverts chat to an earlier state
     * @param id Message ID to revert to
     */
    public revertTo(message_id: string, reset_questionnaire: boolean = true) {
        const index = context.messages.findIndex(x => x.id === message_id);
        if (index > -1) {
            context.messages = context.messages.slice(0, index + 1)
            if (reset_questionnaire)
                useQuestionnaire().reset();
            this.autoSave();
        }
        else {
            console.debug("Message not found, cannot revert to " + message_id)
        }
    }

    /**
     * Rate assistant's message
     * @param id Message ID
     * @param vote Vote value (Upvote when > 0, Downvote when < 0, Revert vote when == 0)
     */
    public rateMessage(id: string, vote: number) {
        const message = context.messages.find(x => x.id === id);
        if (message && message.role === "assistant") {
            message.rating = vote < 0 ? -1 : (vote > 0 ? 1 : 0);
            this.autoSave();
        }
    }

    /**
     * Trigger delayed auto save
     */
    public autoSave() {
        const SAVE_TIMER_DELAY = 10000;
        this.resetAutoSave()

        this.modified = true;

        this.autosave_timer = setTimeout(async () => {
            this.autosave_timer = undefined
            await this.save()
        }, SAVE_TIMER_DELAY)
    }

    /**
     * Cancel scheduled auto save
     */
    public resetAutoSave() {
        if (this.autosave_timer)
            clearTimeout(this.autosave_timer);
        this.autosave_timer = undefined
    }

    /**
     * Forces the chat bot to respond
     */
    public forceResponse() {
        streamResponse();
    }

    /**
     * Regenerate the last assistant message
     */
    public regen() {
        if (this.messages[this.messages.length - 1].role === "assistant") {
            this.messages.splice(this.messages.length - 1, 1);
            streamResponse();
        }
    }

    /**
     * Save the modifications of the current chat
     */
    public async save() {
        const hasUserMessages = context.messages.filter(x => x.role === "user").length > 0;

        if (!useLogin().user || !this.modified || !hasUserMessages)
            return;

        const questionnaire = useQuestionnaire();
        const summary = useSummary();

        if (AireServices.Memory) {
            const state: ChatState = {
                ...this.meta,
                summary: summary.summary,
                keywords: [...summary.keywords],
                questionnaire: questionnaire.active
            };

            const chatLog: AireChatLog = {
                messages: this.messages,
                state: state,
                stats: this.stats
            };

            const cache = useChatCache();

            await AireServices.Memory.saveChat(chatLog, context.id)
                .then(result => {
                    if (result.status == AireStatus.Success && result.data) {
                        cache.set(result.data.id, {
                            messages: this.messages,
                            state: state,
                            stats: this.stats
                        });

                        context.id = result.data.id;
                        context.modified = false;
                        console.log("Chat saved");
                    }
                })
        } else {
            console.error("Memory service is unavailable");
        }
    }

    public async open(chat_id: string): Promise<boolean> {
        if (this.id === chat_id)
            return true;

        await this.reset(false, false);

        const loaded = await this.load(chat_id);
        if (!loaded)
            return false;

        const cached = useChatCache().get(chat_id);

        if (!cached) {
            return false;
        }

        this.id = chat_id
        this.messages = cached.messages;
        this.stats = cached.stats || {};
        this.meta.topic = cached.state.topic;

        const state = cached.state;
        if (state) {
            useSummary().set(state.summary, state.keywords);

            if (state.questionnaire)
                useQuestionnaire().restoreState(state.questionnaire);
        }

        scrollChatToBottom();
        return true;
    }

    public async delete(chat_id: string) {
        if (chat_id == context.id)
            await this.reset(true, false)

        if (AireServices.Memory) {
            await AireServices.Memory.deleteChat(chat_id)
                .then((status) => {
                    if (status === AireStatus.Success) {
                        console.log("Chat deleted", chat_id);
                    }
                    else {
                        console.error("Failed to delete chat", chat_id, status);
                    }
                })
        }

        const cache = useChatCache();
        cache.delete(chat_id);
    }

    public async load(chat_id: string, force: boolean = false): Promise<boolean> {
        const cache = useChatCache();

        if (chat_id in cache && !force) {
            return true;
        }

        if (AireServices.Memory) {
            const result = await AireServices.Memory.getChat(chat_id);
            if (result.status != AireStatus.Success || !result.data)
                return false;

            const chatlog = result.data;
            const state = (chatlog.state || {}) as ChatState;

            cache.set(chat_id, {
                messages: chatlog.messages.map(mapMessage),
                state: state,
                stats: (chatlog.stats || {}) as ChatStats
            })

            return true;
        }
        else {
            console.error("Memory service is not available")
            return false;
        }
    }
}

const context: ChatContext = reactive(new ChatContext());

export default function useChat() {
    return context;
}

async function streamResponse() {
    if (AireServices.AI) {
        useChatbot().setStatus("writing", false);

        const input = getChatbotInputData()
        AireServices.AI.stream(input, receiver, errorHandler);
    } else {
        console.warn("AI service is unavailable");
    }
}

async function receiver(e: AireTalkEvent) {
    const chat = useChat();

    if (e.type === "keywords") {
        onReceiveKeywords(e.keywords || [])
        return;
    }

    if (e.type === "token-count") {
        chat.stats.token_count = e.tokenCount
        return;
    }

    if (e.type === "message" || e.type === "end") {
        const final = (e.type === "end");
        let last = chat.messages[chat.messages.length - 1];
        let firstMessage = false // start of the answer stream?

        if (last.role !== "assistant") {
            last = createAssistantMessage("");
            firstMessage = true
        }

        if (e.message) {
            last.content += e.message.content;
        }

        if (final) {
            const bot = useChatbot();
            bot.setStatus("answered");
        }
        chat.push(last, firstMessage, final);
    }
}

function errorHandler(status: AireStatus) {
    console.error("Chat streaming error: ", status);

    const msg = createErrorMessage(l.error_ai_not_responding);
    useChat().push(msg);

    useChatbot().setStatus("idle");
}

function onReceiveKeywords(keywords: string[]) {
    const summary = useSummary();
    summary.set(summary.summary, keywords);

    if (keywords.length > 0) {
        queryQuestionnaire(keywords)
            .then(q => {
                if (q) {
                    const questionnaire = createQuestionnaire(q);
                    if (questionnaire) {
                        useQuestionnaire().startQuestionnaire(questionnaire);
                    }
                }
            })

        const content = useContent();
        content.search(keywords, 4)
            .then((results) => {
                results = results
                    .filter(x => !getChatContentIds(context.messages).includes(x.id!))
                    .splice(0, 2);

                if (results.length > 0) {
                    const msg = createContentMessage(results);
                    useChat().push(msg);
                }
            })
    }
}
