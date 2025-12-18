// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import useChat from "@/context/chat";
import useQuestionnaire from "@/context/questionnaire";
import { ChatMessageTag, ChatMessageType } from "@/models/chat";
import {
    AireAgentSwitchEvent, AireContentEvent, AireDocumentResultsEvent, AireEndEvent,
    AireKeywordEvent, AireMessageEvent, AireQuestionnaireEvent, AireReminderEvent, AireStatsEvent, AireStatus
} from "aire";
import {
    getLastMessage, listChatKeywords, onEndConversation, pushKeyword, queryQuestionnaires,
    removeKeyword, showContentSuggestions
} from "./chatUtils";
import useTTS from "./textToSpeech";
import { UISettings } from "@/context/ui";
import {
    createAssistantMessage, createInstructionMessage, createReminderCreatedMessage
} from "./chatMessages";
import useStatistics from "@/context/statistics";
import useLogin from "@/context/login";
import { ReminderEvent, ReminderEventName } from "@/models/statistics";
import { fetchAndRankContents, getChatContentIds } from "./contentUtils";
import { createQuestionnaire, getChatQuestionnairesIds } from "./questionnaireUtils";
import useAireMemory from "@/context/memory";
import { getUILanguage } from "@/locales";
import { updateKeywordMetadata } from "./keywordUtils";

class ChatEventHandler {
    private newMessage = false;

    public reset() {
        this.newMessage = false;
    }

    public async handleKeywordEvent(e: AireKeywordEvent) {

        const currentKeywords = listChatKeywords();
        const newKeywords = e.themes.filter(x => !currentKeywords.includes(x.value));
        const oldKeywords = currentKeywords.filter(x => e.themes.findIndex(k => k.value === x) < 0)

        if (newKeywords.length > 0) {
            console.debug("Handling keyword event", e);

            const keywords = await updateKeywordMetadata(newKeywords.map(x => x.value));
            keywords.forEach(pushKeyword);

            queryQuestionnaires(keywords.map(x => x.value));
        }

        oldKeywords.forEach(x => removeKeyword(x, false));
    }

    public async handleQuestionnaireEvent(e: AireQuestionnaireEvent) {
        console.debug("Handling questionnaire event", e);

        const chat = useChat();
        const memory = useAireMemory().agentMemory();
        const questionnaire = useQuestionnaire();

        if (e.results.length > 0) {
            const alreadyAnswered = getChatQuestionnairesIds();
            const lang = getUILanguage();

            const suitable = e.results.filter(x =>
                !alreadyAnswered.includes(x.id) &&
                (!x.language || x.language.includes(lang.value)));

            const best = suitable.filter(x => !x.relevance || x.relevance > 0.75).sort((a, b) => {
                if (a.relevance && b.relevance)
                    return a.relevance - b.relevance
                else
                    return 0;
            }).pop();

            if (best && memory) {
                const result = await memory.getQuestionnaire(best.id);
                if (result.status === AireStatus.Success && result.data) {
                    const q = createQuestionnaire(result.data);
                    if (q) {
                        questionnaire.startQuestionnaire(q);
                        return;
                    }
                }
            }
        }

        const inst = `
        Questionnaire query "${e.search}" did not find suitable questionnaires.
        Carry on with the conversation normally.
    `
        const msg = createInstructionMessage(inst);
        chat.push(msg);
    }

    public async handleContentSuggestionsEvent(e: AireContentEvent) {
        console.debug("Handling content suggestion event", e);

        const chat = useChat();

        if (e.results.length > 0) {
            const currentContent = getChatContentIds(chat.messages);

            const suggestions = e.results
                .filter(x => !currentContent.includes(x.id) && (!x.relevance || x.relevance > 0.75))
                .map(x => x.id);

            if (suggestions.length > 0) {
                const content = await fetchAndRankContents(suggestions);
                if (content.length > 0) {
                    await showContentSuggestions(content);

                    const inst = `
                    You found ${content.length} content suggestions.
                    Summarize the results briefly.
                `
                    const msg = createInstructionMessage(inst);
                    chat.push(msg);
                    return;
                }
            }
        }

        const inst = `
            Did not find any content suggestions with the query "${e.search}".
            Carry on with the conversation normally.
        `
        const msg = createInstructionMessage(inst);
        chat.push(msg);
    }

    public async handleStatsEvent(stats: AireStatsEvent) {
        const chat = useChat();
        chat.stats.token_count = stats.token_count;
    }

    public async handleReminderEvent(e: AireReminderEvent) {
        console.debug("Handling reminder event", e.reminder);

        const chat = useChat();
        const statistics = useStatistics();
        const login = useLogin();

        statistics.sendEvent(new ReminderEvent(
            e.reminder.trigger_timestamp,
            e.reminder.chat_id,
            login.user?.uuid,
            statistics.session?.id,
            ReminderEventName.Added
        ));
        const msg = createReminderCreatedMessage(e.reminder);
        chat.push(msg);

        const inst = createInstructionMessage("A reminder was set successfully.")
        chat.push(inst);
    }

    public async handleDocumentResultsEvent(e: AireDocumentResultsEvent) {
        console.debug("Handling document results event", e);

        const chat = useChat();

        const inst = e.results.length > 0 ? `
            Search with "${e.search}" found the following hits:
            ${e.results.map(x => `
            <
                Document: ${x.metadata.title || x.metadata.source}
                Content:  ${x.content}
            >
            `)}
        ` : `No search results with "${e.search}".`;

        const msg = createInstructionMessage(inst);
        chat.push(msg);
    }

    public async handleMessageEvent(message: AireMessageEvent) {
        const chat = useChat();

        let last = chat.messages[chat.messages.length - 1];
        let firstMessage = false // start of the answer stream?

        if (last.role !== "assistant") {
            if (message && message.content.length > 0) {
                last = createAssistantMessage("");
                firstMessage = true
                this.newMessage = true;
            }
            else {
                return;
            }
        }

        if (message) {
            last.content += message.content;
        }

        chat.push(last, firstMessage, false);
    }

    public async handleAgentSwitchEvent(e: AireAgentSwitchEvent) {
        const chat = useChat();
        chat.state.agent = e.agent;
        // TODO: Add system message to notify user of the switch
    }

    public async handleEndEvent(e: AireEndEvent) {
        const chat = useChat();
        const tts = useTTS();

        let endConversation = false;

        const message = chat.messages
            .findLast(x =>
                x.role === "assistant" &&
                x.type === ChatMessageType.Default &&
                x.content !== undefined)
        const last = getLastMessage();

        if (message && this.newMessage) {
            if (message.content?.includes(ChatMessageTag.END_OF_CONVERSATION_TAG)) {
                message.content = message.content.replace(ChatMessageTag.END_OF_CONVERSATION_TAG, "").trim();
                endConversation = true;
            }

            if (message.content?.includes(ChatMessageTag.RED_FLAG_TAG)) {
                message.content = message.content.replace(ChatMessageTag.RED_FLAG_TAG, "").trim();
                chat.state.red_flag_triggered = true;
            }

            if (message.id === last?.id)
                chat.push(last, false, true);

            if (UISettings.ttsEnabled)
                tts.speak(message.content!);
        }

        if (endConversation || chat.state.red_flag_triggered) {
            await onEndConversation();
        }
        else {
            if (!e.received_message) {
                if (!useQuestionnaire().active)
                    chat.forceResponse();
            }
        }

        this.newMessage = false;
    }
}

const ChatEvents = new ChatEventHandler();
export default ChatEvents;
