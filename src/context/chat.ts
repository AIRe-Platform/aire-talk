// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.


import { scrollChatToBottom } from "@/helpers/scrollToMessage";
import { ChatMessage, ChatState, ChatStats } from "@/models/chat";
import {
    AireServices,
    AireTalkEvent,
    AireChatLog,
    AireStatus,
    AireEventType,
} from "aire";
import { reactive } from "vue";
import {
    mapMessage,
    createErrorMessage,
    createSystemMessage,
    createUserMessage,
    createInstructionMessage,
} from "@/helpers/chatMessages";
import useChatbot from "./chatbot";
import { useChatCache } from "./cache";
import useQuestionnaire from "./questionnaire";
import { l } from "@/locales";
import {
    getChatbotInputData,
    listChatKeywords,
    findLatestSummaryMessage,
    findChatKeywords,
    getDefaultAgent,
} from "@/helpers/chatUtils";
import useLogin from "./login";
import useStatistics from "./statistics";
import { ResponseTimeEvent } from "@/models/statistics";
import useAireMemory from "./memory";
import ChatEvents from "@/helpers/chatEventHandler";
import useKeywords from "./keywords";
import { DateTime } from "luxon";

export class ChatContext {
    private cache = useChatCache();

    private autosave_timer?: number;
    private modified: boolean;
    private forced_response: boolean;
    protected response_received: boolean;

    public id?: string;
    public messages: Array<ChatMessage>;
    public stats: ChatStats;
    public state: ChatState;

    constructor() {
        this.modified = false;
        this.messages = [];
        this.stats = {};
        this.state = {};
        this.forced_response = false;
        this.response_received = false;
    }

    /** Resets the chat state */
    public async reset(skip_save: boolean = false, clear_cache = false) {
        this.resetAutoSave()

        if (!skip_save) {
            await this.save()
        }

        if (clear_cache) {
            this.cache.clear();
        }

        this.id = undefined;
        this.messages = [];
        this.modified = false;
        this.stats = {};
        this.state = {
            agent: getDefaultAgent()?.name
        };
        useQuestionnaire().reset();
        this.response_received = false;

        const system_message = createSystemMessage(l.system_greeting);
        this.push(system_message, true, false);
    }

    /** 
     * Reset current chat with a new one
     */
    public async startNew() {
        await this.reset(false, false);
    }

    /**
     * Add new user message and wait response from the chatbot
     * @param message Message content
     */
    public send(message: string) {
        const msg = createUserMessage(message);
        this.push(msg);

        this.forced_response = false;
        this.response_received = false;
        streamResponse(false);
    }

    /**
     * Push a new message
     * @param message Message
     * @param create Set to false if you want to modify the last message
     * @param auto_save Set to true to start automatic save timer
     */
    public push(message: ChatMessage, create: boolean = true, auto_save: boolean = true) {
        if (create) {
            this.messages.push(message);
        } else {
            this.messages[this.messages.length - 1] = message;
        }

        if (auto_save) {
            this.autoSave();
        }

        scrollChatToBottom();
    }

    /**
     * Reverts chat to an earlier state
     * @param id Message ID to revert to
     */
    public revertTo(message_id: string, reset_questionnaire: boolean = true) {
        const index = this.messages.findIndex(x => x.id === message_id);
        if (index > -1) {
            const reverted = this.messages.splice(index + 1);
            const revertedKeywords = findChatKeywords(reverted);

            if (this.state.themes)
                this.state.themes = this.state.themes.filter(x => !revertedKeywords.includes(x.value));

            const lastAssistantMessage = this.messages.findLast(x => x.role === 'assistant');
            if (lastAssistantMessage)
                this.state.agent = lastAssistantMessage.agent;

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
        if (!this.forced_response) {
            this.forced_response = true;
            streamResponse(true);
        }
    }

    /**
     * Regenerate the last assistant message
     */
    public regen() {
        if (this.messages[this.messages.length - 1].role === "assistant") {
            this.messages.splice(this.messages.length - 1, 1);
            this.forced_response = true;
            streamResponse(true);
        }
    }

    /**
     * Save the modifications of the current chat
     */
    public async save() {
        const hasUserMessages = this.messages.filter(x => x.role === "user").length > 0;

        if (!useLogin().user || !this.modified || !hasUserMessages)
            return;

        const questionnaire = useQuestionnaire();
        const memory = useAireMemory().platformDefault();

        if (memory) {
            this.state.summary = findLatestSummaryMessage(this.messages)?.content;
            this.state.questionnaire = questionnaire.active;

            const chatLog: AireChatLog = {
                messages: this.messages,
                stats: this.stats,
                state: this.state,
            };

            await memory.saveChat(chatLog, this.id)
                .then(result => {
                    if (result.status == AireStatus.Success && result.data) {
                        this.cache.set(result.data.id, {
                            metadata: result.data,
                            messages: this.messages,
                            state: this.state,
                            stats: this.stats
                        });

                        this.id = result.data.id;
                        this.modified = false;
                        console.debug("Chat saved");
                    }
                })
        } else {
            console.error("Memory service is unavailable");
        }
    }

    public async open(id: string): Promise<boolean> {
        if (this.id === id)
            return true;

        let cached = this.cache.get(id);
        if (!cached) {
            const load = await this.load(id);
            if (!load) {
                console.warn("Failed to load chat", id);
                return false;
            }
            cached = this.cache.get(id)!;
        }

        await this.reset(false, false);

        this.id = id;
        this.messages = cached.messages || [];
        this.stats = cached.stats || {};
        this.state = cached.state || {};

        if (this.messages.length === 0) {
            const system_message = createSystemMessage(l.system_greeting);
            this.push(system_message, true, false);
        }

        const state = cached.state;
        if (state) {
            if (state.questionnaire)
                useQuestionnaire().restoreState(state.questionnaire);
        }

        const themes = listChatKeywords();
        const themeMeta = await useKeywords().updateMetadata(themes);
        this.state.themes = themeMeta;

        scrollChatToBottom();
        return true;
    }

    public async delete(chat_id: string) {
        if (chat_id == this.id)
            await this.reset(true, false)

        const memory = useAireMemory().platformDefault();

        if (memory) {
            await memory.deleteChat(chat_id)
                .then((status) => {
                    if (status === AireStatus.Success) {
                        console.log("Chat deleted", chat_id);
                    }
                    else {
                        console.error("Failed to delete chat", chat_id, status);
                    }
                })
        }

        this.cache.delete(chat_id);
    }

    public async load(id: string): Promise<boolean> {
        const memory = useAireMemory().platformDefault();
        if (!memory) {
            console.error("Memory service is not available")
            return false;
        }

        const result = await memory.getChat(id);
        if (result.status != AireStatus.Success || !result.data)
            return false;

        const chatlog = result.data;
        const state = (chatlog.state || {}) as ChatState;
        const messages = chatlog.messages.map(mapMessage);

        this.cache.set(id, {
            metadata: result.data.metadata || { id: id, time: DateTime.now().toISO() },
            messages: messages,
            state: state,
            stats: (chatlog.stats || {}) as ChatStats
        })

        return true;
    }

    public onReceivingMessage() {
        this.response_received = true;
    }

    public onMessageReceived() {
        console.debug("Message ended. Response received:", this.response_received);
        if (!this.response_received)
            this.forceResponse();
    }

    public forceFollowUp() {
        console.debug("Forcing follow up response");
        this.response_received = false;
    }
}

const context = reactive(new ChatContext());
export default function useChat() {
    return context;
}

async function streamResponse(force: boolean) {
    const statistics = useStatistics();
    const chat = useChat();
    const start = Date.now(); // Start time

    if (AireServices.AI) {
        useChatbot().makeBusy(false);
        const input = getChatbotInputData();
        input.disable_tools = force;

        // Measure the time taken to start the response
        await AireServices.AI.stream(input, receiver, errorHandler);

        const responseTime = Date.now() - start; // Calculate response time
        statistics.sendEvent(new ResponseTimeEvent(responseTime, chat.id));

        // Only add delay if the response was quick (less than 200 ms)
        if (responseTime < 200) {
            useChatbot().makeBusy(false);
            const randomDelay = Math.floor(Math.random() * (400 - 100 + 1)) + 100;
            await new Promise(resolve => setTimeout(resolve, randomDelay));

            useChatbot().reportReady();
            console.debug(`Applied delay of ${randomDelay} ms.`);
        } else {
            console.debug(`No delay applied; response time was ${responseTime} ms.`);
        }
    } else {
        console.warn("AI service is unavailable");
    }
}

// Return true if event handled
async function receiver(e: AireTalkEvent) {
    const chat = useChat();
    if (chat.state.red_flag_triggered)
        return;

    if (e.type === AireEventType.Keywords && e.keywords) {
        await ChatEvents.handleKeywordEvent(e.keywords);
        return;
    }

    if (e.type === AireEventType.Questionnaire && e.questionnaire) {
        await ChatEvents.handleQuestionnaireEvent(e.questionnaire);
        return;
    }

    if (e.type === AireEventType.ContentSuggestions && e.content_suggestions) {
        await ChatEvents.handleContentSuggestionsEvent(e.content_suggestions);
        return;
    }

    if (e.type === AireEventType.TokenStats && e.stats) {
        await ChatEvents.handleStatsEvent(e.stats);
        return;
    }

    if (e.type === AireEventType.Reminder && e.reminder) {
        await ChatEvents.handleReminderEvent(e.reminder);
        return;
    }

    if (e.type === AireEventType.DocumentResults && e.document_results) {
        await ChatEvents.handleDocumentResultsEvent(e.document_results);
        return;
    }

    if (e.type === AireEventType.AgentSwitch && e.agent_switch) {
        await ChatEvents.handleAgentSwitchEvent(e.agent_switch)
        return;
    }

    if (e.type === AireEventType.Message && e.message) {
        chat.onReceivingMessage();
        await ChatEvents.handleMessageEvent(e.message);
        return;
    }

    if (e.type === AireEventType.End && e.end) {
        await ChatEvents.handleEndEvent(e.end);
        chat.onMessageReceived();
        useChatbot().reportReady();
    }
}

function errorHandler(status: AireStatus) {
    console.error("Chat streaming error: ", status);
    if (status === AireStatus.RateLimited) {
        const inst = createInstructionMessage(`
            The service is currently experiencing high load. 
            Apologize to the user when they get through and proceed with the conversation.`);
        useChat().push(inst);

        const msg = createErrorMessage(l.error_ai_rate_limited);
        useChat().push(msg);
    }
    else {
        const inst = createInstructionMessage(`
            There was an internal error with the service.
            Apologize to the user when they get through and proceed with the conversation.`);
        useChat().push(inst);

        const msg = createErrorMessage(l.error_ai_not_responding);
        useChat().push(msg);
    }
    useChatbot().reportReady();
}
