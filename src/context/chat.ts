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
    mapMessage,
    createErrorMessage,
    createSystemMessage,
    createUserMessage,
} from "@/helpers/chatMessages";
import useChatbot from "./chatbot";
import { useChatCache } from "./cache";
import useQuestionnaire from "./questionnaire";
import i18n, { l } from "@/locales";
import {
    getChatbotInputData,
    listChatKeywords,
    findLatestSummaryMessage,
    handleReminderEvent,
    handleKeywordEvent,
    handleContentSuggestionsEvent,
    handleQuestionnaireEvent,
    handleEndEvent,
    handleMessageEvent,
} from "@/helpers/chatUtils";
import useLogin from "./login";
import { updateKeywordMetadata } from "@/helpers/keywordUtils";

export class ChatContext {
    id?: string;
    autosave_timer?: number;
    modified: boolean;

    public messages: Array<ChatMessage>;
    public stats: ChatStats;
    public state: ChatState;

    constructor() {
        this.modified = false;
        this.messages = [];
        this.stats = {};
        this.state = {};
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
        this.modified = false;
        this.stats = {};
        this.state = {};
        useQuestionnaire().reset();

        const system_message = createSystemMessage(l.system_greeting);
        this.push(system_message);
    }

    /** 
     * Reset current chat with a new one
     */
    public async startNew(topic?: Topic) {
        await this.reset(false, false);
        if (topic) {
            this.state.topic = topic;
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

        if (final) {
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

        if (AireServices.Memory) {
            this.state.summary = findLatestSummaryMessage(this.messages)?.content;
            this.state.questionnaire = questionnaire.active;

            const chatLog: AireChatLog = {
                messages: this.messages,
                stats: this.stats,
                state: this.state,
            };

            const cache = useChatCache();

            await AireServices.Memory.saveChat(chatLog, context.id)
                .then(result => {
                    if (result.status == AireStatus.Success && result.data) {
                        cache.set(result.data.id, {
                            messages: this.messages,
                            state: this.state,
                            stats: this.stats
                        });

                        context.id = result.data.id;
                        context.modified = false;
                        console.debug("Chat saved");
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

        this.id = chat_id;
        this.messages = cached.messages;
        this.stats = cached.stats || {};
        this.state = cached.state;

        const state = cached.state;
        if (state) {
            if (state.questionnaire)
                useQuestionnaire().restoreState(state.questionnaire);
        }

        updateKeywordMetadata(listChatKeywords(this.messages));

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
        useChatbot().makeBusy();
        const input = getChatbotInputData()
        AireServices.AI.stream(input, receiver, errorHandler);
    } else {
        console.warn("AI service is unavailable");
    }
    // Generate a random delay between between 1000 ms and 500 ms
    const randomDelay = Math.floor(Math.random() * (1000 - 500 + 1)) + 500;

    // Create a delay promise that resolves after the random delay
    const delayPromise = new Promise<void>((resolve) => {
        setTimeout(() => {
            if (AireServices.AI) {
                useChatbot().makeBusy();
        
                const input = getChatbotInputData()
                AireServices.AI.stream(input, receiver, errorHandler);
            } else {
                console.warn("AI service is unavailable");
            }
            console.debug(`Delay of ${randomDelay} ms complete.`);
            resolve();
        }, randomDelay);
    });
}

// Return true if event handled
async function receiver(e: AireTalkEvent) {
    const chat = useChat();

    if (chat.state.red_flag_triggered)
        return;

    if (e.type === "keywords" && e.keywords) {
        await handleKeywordEvent(e.keywords);
        return;
    }

    if (e.type === "questionnaire" && e.questionnaire) {
        await handleQuestionnaireEvent(e.questionnaire);
        return;
    }

    if (e.type === "content-suggestions" && e.content_suggestions) {
        await handleContentSuggestionsEvent(e.content_suggestions);
        return;
    }

    if (e.type === "token-count") {
        chat.stats.token_count = e.tokenCount
        return;
    }

    if (e.type === "reminder" && e.reminder) {
        await handleReminderEvent(e.reminder);
        return;
    }

    if (e.type === "message" && e.message) {
        await handleMessageEvent(e.message);
    }

    if (e.type === "end" && e.end) {
        await handleEndEvent(e.end);
        useChatbot().reportReady();
    }
}

function errorHandler(status: AireStatus) {
    console.error("Chat streaming error: ", status);

    const msg = createErrorMessage(l.error_ai_not_responding);
    useChat().push(msg);

    useChatbot().reportReady();
}