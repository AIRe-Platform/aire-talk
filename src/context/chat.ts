// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.


import { scrollChatToBottom } from "@/helpers/scrollToMessage";
import { ChatMessage, ChatMessageType, ChatState, ChatStats } from "@/models/chat";
import { Topic } from "@/models/topic";
import {
    AireServices,
    AireTalkEvent,
    AireChatLog,
    AireStatus,
    AireKeyword,
    AireReminder,
} from "aire";
import { reactive } from "vue";
import {
    mapMessage,
    createErrorMessage,
    createSystemMessage,
    createUserMessage,
    createAssistantMessage,
    createInstructionMessage,
    createKeywordMessage,
    createSummaryMessage,
    createContentMessage,
    createControlFlowMessage,
    createReminderCreatedMessage
} from "@/helpers/chatMessages";
import useChatbot from "./chatbot";
import { useChatCache } from "./cache";
import useQuestionnaire from "./questionnaire";
import i18n, { l } from "@/locales";
import { getChatbotInputData, listChatKeywords, findLatestSummaryMessage, conversationEnded, getLastMessage } from "@/helpers/chatUtils";
import useLogin from "./login";
import { createQuestionnaire, queryQuestionnaire } from "@/helpers/questionnaireUtils";
import useContent from "./content";
import { getChatContentIds } from "@/helpers/contentUtils";
import { updateKeywordMetadata } from "@/helpers/keywordUtils";
import { DateTime } from "luxon";

const RED_FLAG_TAG = "[RED_FLAG]";
const END_OF_CONVERSATION_TAG = "[END_OF_CONVERSATION]";

export class ChatContext {
    id?: string;
    autosave_timer?: number;
    modified: boolean;
    keyword_blacklist: Set<string>;
    questionnaire_queries: Array<string>;
    content_queries: Array<string>;
    is_red_flag_triggered: boolean;
    public messages: Array<ChatMessage>;
    public stats: ChatStats;
    public meta: {
        year_of_birth?: number;
        occupation?: string;
        topic?: Topic;
    };

    constructor() {
        this.messages = [];
        this.stats = {};
        this.meta = {};
        this.modified = false;
        this.keyword_blacklist = new Set<string>();
        this.questionnaire_queries = new Array<string>();
        this.content_queries = new Array<string>();
        this.is_red_flag_triggered = false;
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
        this.keyword_blacklist.clear();
        this.questionnaire_queries = [];
        this.content_queries = [];
        this.is_red_flag_triggered = false;
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
            this.meta.topic = topic;
            const topic_msg = i18n.global.t(l.system_topic);
            const topic_name = i18n.global.t(topic.localization_key);
            const msg = createSystemMessage(`${topic_msg}${topic_name}`, false);
            this.push(msg);
        }
    }

    /**
     * Inject keyword with a prompt into the conversation
     * @param keyword Keyword object
     */
    public pushKeyword(keyword: AireKeyword) {
        if (this.keyword_blacklist.has(keyword.value))
            return;

        const notification = createKeywordMessage(keyword.value);
        this.push(notification);

        // Create hidden prompt injection
        const prompt = keyword.prompt ?? `The system has identified a topic: ${keyword.value}`
        const promptMessage = createInstructionMessage(prompt);
        this.push(promptMessage);
    }

    /**
     * Finds keyword notification message and its injected prompt
     * @param keyword Keyword to remove
     * @param blacklist Set true to prevent keyword from coming back
     */
    public removeKeyword(keyword: string, blacklist: boolean = false) {
        const i = this.messages
            .findIndex(x => x.type == ChatMessageType.Keyword && x.content == keyword);

        if (i > -1) {
            if (this.messages.length < i + 1) {
                // Check if the next message is an instruction
                if (this.messages[i + 1].type == ChatMessageType.Instruction) {
                    this.messages.splice(i + 1, 1);
                }
            }
            this.messages.splice(i, 1);
        }

        if (blacklist) {
            this.keyword_blacklist.add(keyword);
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
     * When the user trigger end of the convesation, the sumarize and suggestion are shown if not red flag have been triggered
     */
    public async endConversation() {

        if (!this.is_red_flag_triggered) {
            await this.summarize();
        } else {
            const end = createControlFlowMessage(ChatMessageType.EndOfConversation, l.system_end_of_conversation);
            this.messages.push(end);
        }
    }

    /**
     * Continues the conversation
     */
    public async continueConversation() {
        const optionsIndex = this.messages.findLastIndex(x => x.type == ChatMessageType.EndOfConversationOptions);
        if (optionsIndex > -1)
            this.messages.splice(optionsIndex, 1);

        const endMessageIndex = this.messages.findLastIndex(x => x.type == ChatMessageType.EndOfConversation);
        if (endMessageIndex > -1)
            this.messages.splice(endMessageIndex, 1);

        const cont = createControlFlowMessage(ChatMessageType.ContinueConversation);
        this.messages.push(cont);

        const inst = createInstructionMessage("The user wishes to continue the conversation.");
        this.messages.push(inst);
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

        if (AireServices.Memory) {
            const state: ChatState = {
                ...this.meta,
                summary: findLatestSummaryMessage(this.messages)?.content,
                questionnaire: questionnaire.active,
                keyword_blacklist: [...this.keyword_blacklist],
                questionnaire_queries: this.questionnaire_queries,
                content_queries: this.content_queries,
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
        this.meta.topic = cached.state.topic;
        this.keyword_blacklist = new Set(cached.state.keyword_blacklist);
        this.questionnaire_queries = cached.state.questionnaire_queries || [];
        this.content_queries = cached.state.content_queries || [];

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

    public async summarize(): Promise<boolean> {
        if (!AireServices.AI) {
            console.warn("AI service is unavailable");
            return false;
        }

        const input = getChatbotInputData();
        if (input.chat.length == 0) {
            return false;
        }

        useChatbot().makeBusy();

        return await AireServices.AI.generateSummary(input)
            .then((result) => {
                if (result.status == AireStatus.Success && result.data) {
                    const msg = createSummaryMessage(result.data, true);
                    this.push(msg);
                    return true;
                } else {
                    throw Error(result.status.toString());
                }
            })
            .catch((err) => {
                console.error("Failed to generate summary: ", err);
                return false;
            })
            .finally(() => useChatbot().reportReady())
    }

    public async queryQuestionnaires(keywords: string[]): Promise<boolean> {
        if (keywords.length > 0) {
            const q = keywords.sort().join(",");
            if (this.questionnaire_queries.includes(q))
                return false; // No requeries with the same keys

            useChatbot().makeBusy();
            return await queryQuestionnaire(keywords)
                .then(questionnaire => {
                    this.questionnaire_queries.push(q);
                    if (questionnaire) {
                        const q = createQuestionnaire(questionnaire);
                        if (q) {
                            useQuestionnaire().startQuestionnaire(q);
                            return true;
                        }
                    }
                    return false;
                })
                .finally(() => useChatbot().reportReady())
        }
        return false;
    }

    public async suggestContent(keywords: string[]): Promise<number> {
        if (!this.is_red_flag_triggered) {
            if (keywords.length > 0) {
                const q = keywords.sort().join(",");
                if (this.content_queries.includes(q))
                    return 0; // No requeries with the same keys

                useChatbot().makeBusy();

                return await useContent()
                    .search(keywords, 4)
                    .then(async results => {
                        // Filter out already suggested content
                        const content = results.filter(x => !getChatContentIds(this.messages).includes(x.id!));
                        if (content.length > 0) {
                            const msg = createContentMessage(results);
                            this.push(await msg);
                            return content.length;
                        }
                        return 0;
                    })
                    .finally(() => useChatbot().reportReady());
            }
        }
        return 0;
    }

    public onCreatedReminder(reminder: AireReminder) {
        const msg = createReminderCreatedMessage(reminder);
        this.push(msg);

        const inst = createInstructionMessage("A reminder was set successfully.")
        this.push(inst);
    }

    public async onContinueConversation(id: string): Promise<boolean> {
        const loaded = await this.open(id);
        if (!loaded)
            return false;

        const last = getLastMessage();
        if (!last)
            return false;

        if (conversationEnded(this.messages))
            this.continueConversation();

        let instruction = "The user has returned to the conversation. Ask about their progress and aim to motivate them.";

        const timeDiff = DateTime.utc().diff(DateTime.fromMillis(last.timestamp!));
        if (timeDiff.isValid)
            instruction += ` It has been ${timeDiff.days} days since you last talked to them.`

        const inst = createInstructionMessage(instruction);
        this.push(inst);
        this.forceResponse();

        return true;
    }

    public async onAcceptSummary()
    {
        await this.suggestContent(listChatKeywords(this.messages));

        const end = createControlFlowMessage(ChatMessageType.EndOfConversation, l.system_end_of_conversation);
        this.push(end);
    
        const options = createControlFlowMessage(ChatMessageType.EndOfConversationOptions, l.system_end_of_conversation_options);
        this.push(options);
    }

    public onRejectSummary()
    {
        const instruction = `
            The user rejected the summary. 
            Ask what is wrong with it and how the user would like to have it modified.
            After that, you should end the conversation with ${END_OF_CONVERSATION_TAG} to create a new summary.
        `;

        const inst = createInstructionMessage(instruction);
        this.push(inst);
        this.forceResponse();
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
}

async function receiver(e: AireTalkEvent) {
    const chat = useChat();

    if (chat.is_red_flag_triggered)
        return;

    if (e.type === "keywords" && e.keywords) {
        const currentKeywords = listChatKeywords(chat.messages);
        const newKeywords = e.keywords.filter(x => !currentKeywords.includes(x));
        (await updateKeywordMetadata(newKeywords)).forEach(k => chat.pushKeyword(k));

        // Search questionnaires and start prompt to start one if found
        await chat.queryQuestionnaires(e.keywords);
        return;
    }

    if (e.type === "token-count") {
        chat.stats.token_count = e.tokenCount
        return;
    }

    if (e.type === "reminder" && e.reminder) {
        chat.onCreatedReminder(e.reminder);
        return;
    }

    if (e.type === "message" || e.type === "end") {
        const final = (e.type === "end");
        let last = chat.messages[chat.messages.length - 1];
        let firstMessage = false // start of the answer stream?
        let endConversation = false;

        if (last.role !== "assistant") {
            if (e.message && e.message.content.length > 0) {
                last = createAssistantMessage("");
                firstMessage = true
            }
            else {
                // Ignore empty message
                return;
            }
        }

        if (e.message) {
            last.content += e.message.content;
        }

        if (final) {
            useChatbot().reportReady();

            if (last.content?.includes(END_OF_CONVERSATION_TAG)) {
                last.content = last.content.replace(END_OF_CONVERSATION_TAG, "").trim();
                endConversation = true;
            }
            if (last.content?.includes(RED_FLAG_TAG)) {
                last.content = last.content.replace(RED_FLAG_TAG, "").trim();
                endConversation = true;
                chat.is_red_flag_triggered = true;
            }
        }

        chat.push(last, firstMessage, final);

        if (endConversation || chat.is_red_flag_triggered) {
            await chat.endConversation();
        }
    }
}

function errorHandler(status: AireStatus) {
    console.error("Chat streaming error: ", status);

    const msg = createErrorMessage(l.error_ai_not_responding);
    useChat().push(msg);

    useChatbot().reportReady();
}
