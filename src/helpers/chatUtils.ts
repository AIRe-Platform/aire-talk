// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import useChat from "@/context/chat";
import { getUILanguage, l } from "@/locales";
import { ChatMessage, ChatMessageTag, ChatMessageType } from "@/models/chat";
import {
    AireChatMessage,
    AireChatMetadata,
    AireChatStats,
    AireChatbotEndEvent,
    AireChatbotInput,
    AireChatbotMessageEvent,
    AireContent,
    AireContentEvent,
    AireKeyword,
    AireQuestionnaireEvent,
    AireReminder,
    AireServices,
    AireStatus,
    AireTalkKeywords
} from "aire";
import {
    createAssistantMessage,
    createContentMessage,
    createControlFlowMessage,
    createInstructionMessage,
    createKeywordMessage,
    createReminderCreatedMessage,
    createSummaryMessage
} from "./chatMessages";
import useChatbot from "@/context/chatbot";
import useContent from "@/context/content";
import { fetchAndRankContents, getChatContentIds } from "./contentUtils";
import { createQuestionnaire, getChatQuestionnairesIds, queryQuestionnaire } from "./questionnaireUtils";
import useQuestionnaire from "@/context/questionnaire";
import { DateTime } from "luxon";
import { updateKeywordMetadata } from "./keywordUtils";
import useTTS from "./textToSpeech";
import { UISettings } from "@/context/ui";
import useStatistics from "@/context/statistics";
import { ChatSummaryAcceptEvent, ChatThemeEvent, ChatThemeEventName, ContentEvent, ContentEventName, ReminderEvent, ReminderEventName } from "@/models/statistics";
import useLogin from "@/context/login";
import { useChatCache } from "@/context/cache";

const statistics = useStatistics();
const chat = useChat();
const login = useLogin();

/**
 * Function that gets all the chats the user has save in the database order from newest to oldest.
 * @returns array of chats format id: string, date: string
 */
export async function getAllChats(): Promise<AireChatMetadata[]> {
    if (AireServices.Memory) {
        const result = await AireServices.Memory.getChatlogs()
        if (result.data) {
            return result.data.sort((b, a) => {
                return Date.parse(a.time) - Date.parse(b.time)
            });
        }
    } else {
        console.error("Memory service is not available")
    }
    return []
}

/**
 * Send the current chat to AI to get statistics
 * @returns Token count
 */
export async function getChatStats(): Promise<AireChatStats | undefined> {
    if (AireServices.AI) {
        const input = getChatbotInputData();
        return (await AireServices.AI.getChatStats(input)).data
    }
}

/**
 * Constructs chatbot input data structure
 * @returns Input data for chatbot
 */
export function getChatbotInputData(): AireChatbotInput {
    const locale = getUILanguage();

    const messages = chat.messages
        .filter(x => x.role === "assistant" || x.role === "user" || x.type == ChatMessageType.Instruction)
        .map(x => {
            const m: AireChatMessage = x;
            return m;
        })

    const input: AireChatbotInput = {
        chat_id: chat.id,
        chat: messages,
        context: {
            year_of_birth: chat.state.year_of_birth,
            occupation: chat.state.occupation,
            topic: chat.state.topic?.name,
            language: locale.value,
            keywords: listChatKeywords(chat.messages)
        }
    };

    return input;
}

export function listChatKeywords(messages: ChatMessage[]) {
    return messages
        .filter(x => x.type == ChatMessageType.Keyword && x.content)
        .map(x => x.content!);
}

export function conversationEnded(messages: ChatMessage[]) {
    let ended = false;
    messages.forEach(x => {
        if (x.type == ChatMessageType.EndOfConversation)
            ended = true;
        else if (x.type == ChatMessageType.ContinueConversation)
            ended = false;
    })
    return ended;
}

export function findLatestSummaryMessage(messages: ChatMessage[]): ChatMessage | undefined {
    return messages.findLast(x => x.type == ChatMessageType.Summary);
}

export function getLastMessage(): ChatMessage | undefined {
    return chat.messages.length > 0 ? chat.messages[chat.messages.length - 1] : undefined;
}

export async function onAcceptSummary() {
    const keywords = listChatKeywords(chat.messages)
    keywords.forEach((kw) => statistics.sendEvent(new ChatThemeEvent(
        kw,
        chat.id,
        login.user?.uuid,
        statistics.session?.id,
        ChatThemeEventName.ThemeConfirmed,
    )))
    await suggestContentWithKeywords(keywords);

    const end = createControlFlowMessage(ChatMessageType.EndOfConversation, l.system_end_of_conversation);
    chat.push(end);

    const options = createControlFlowMessage(ChatMessageType.EndOfConversationOptions, l.system_end_of_conversation_options);
    chat.push(options);

    let log;
    if (chat.id) {
        log = useChatCache().get(chat.id);
    }
    const tokenCount = log?.stats?.token_count;
    const summary = findLatestSummaryMessage(chat.messages)?.content;

    statistics.sendEvent(new ChatSummaryAcceptEvent(
        tokenCount,
        keywords.join(','),
        chat.id,
        login.user?.uuid,
        statistics.session?.id,
        summary
    ));
}

export function onRejectSummary() {
    const instruction = `
        The user rejected the summary. 
        Ask what is wrong with it and how the user would like to have it modified.
    `;

    const inst = createInstructionMessage(instruction);
    chat.push(inst);
    chat.forceResponse();
}

export async function suggestContentWithKeywords(keywords: string[]): Promise<number> {
    //in case it is a new chat and there is no id yet
    await chat.save();

    if (chat.state.red_flag_triggered || keywords.length === 0) {
        return 0;
    }
    const q = keywords.sort().join(",");
    if (chat.state.content_queries?.includes(q))
        return 0; // No requeries with the same keys

    useChatbot().makeBusy();

    return await useContent()
        .search(keywords, 4)
        .then(async results => {
            // Filter out already suggested content
            const content = results.filter(x => !getChatContentIds(chat.messages).includes(x.id!));
            if (content.length > 0)
                await showContentSuggestions(content);
            return content.length;
        })
        .finally(() => useChatbot().reportReady());
}

export async function showContentSuggestions(content: AireContent[]) {
    if (content.length === 0)
        return;

    const msg = await createContentMessage(content);
    chat.push(msg);

    const keywords = listChatKeywords(chat.messages).join(',');
    content.forEach(x => {
        if (!x.name && !x.description)
            return;

        let inst = "A new content suggestion was added to the conversation.";
        if (x.name)
            inst = `\nTitle: ${x.name}`;
        if (x.description)
            inst = `\nDescription: ${x.description}`;

        statistics.sendEvent(new ContentEvent(
            x.id,
            x.name,
            keywords,
            chat.id,
            login.user?.uuid,
            statistics.session?.id,
            ContentEventName.Showed
        ));

        const msg = createInstructionMessage(inst);
        chat.push(msg);
    })
}

export async function openAndContinueChat(id: string): Promise<boolean> {
    const loaded = await chat.open(id);
    if (!loaded)
        return false;

    if (chat.id === id)
        return true;

    const last = getLastMessage();
    if (!last)
        return false;

    if (conversationEnded(chat.messages))
        continueConversation();

    const timeDiff = DateTime.utc().diff(DateTime.fromMillis(last.timestamp!));

    let instruction = "The user has returned to the conversation. Ask about their progress and aim to motivate them.";

    if (timeDiff.isValid) {
        // Skip additional instructions and force response if the conversation is still fresh
        if (timeDiff.as('minutes') < 15)
            return true;

        if (timeDiff.as('days') > 1)
            instruction += ` It has been ${Math.round(timeDiff.as('days'))} days since you last talked to them.`
        else if (timeDiff.as('hours') > 2)
            instruction += ` It has been ${Math.round(timeDiff.as('hours'))} hours since you last talked to them.`
        else
            instruction += ` It has been ${Math.round(timeDiff.as('minutes'))} minutes since you last talked to them.`
    }

    const inst = createInstructionMessage(instruction);
    chat.push(inst);
    chat.forceResponse();

    return true;
}

export async function summarizeChat(): Promise<boolean> {
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
                const inst = createInstructionMessage(`Generated summary: ${result.data}`);
                chat.push(inst);

                const msg = createSummaryMessage(result.data);
                chat.push(msg);

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

export async function queryQuestionnaires(keywords: string[]): Promise<boolean> {
    if (keywords.length > 0) {
        const q = keywords.sort().join(",");
        if (chat.state.questionnaire_queries?.includes(q))
            return false; // No requeries with the same keys

        useChatbot().makeBusy();
        return await queryQuestionnaire(keywords)
            .then(questionnaire => {
                chat.state.questionnaire_queries ??= [];
                chat.state.questionnaire_queries.push(q);
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

/**
 * When the user trigger end of the convesation, the sumarize and suggestion are shown if not red flag have been triggered
 */
export async function onEndConversation() {
    if (!chat.state.red_flag_triggered) {
        await summarizeChat();
    } else {
        const end = createControlFlowMessage(ChatMessageType.EndOfConversation, l.system_end_of_conversation);
        chat.messages.push(end);
    }
}

/**
 * Continues the conversation
 */
export async function continueConversation() {
    const optionsIndex = chat.messages.findLastIndex(x => x.type == ChatMessageType.EndOfConversationOptions);
    if (optionsIndex > -1)
        chat.messages.splice(optionsIndex, 1);

    const endMessageIndex = chat.messages.findLastIndex(x => x.type == ChatMessageType.EndOfConversation);
    if (endMessageIndex > -1)
        chat.messages.splice(endMessageIndex, 1);

    const cont = createControlFlowMessage(ChatMessageType.ContinueConversation);
    chat.messages.push(cont);

    const inst = createInstructionMessage("The user wishes to continue the conversation.");
    chat.messages.push(inst);
}

/**
 * Rate assistant's message
 * @param id Message ID
 * @param vote Vote value (Upvote when > 0, Downvote when < 0, Revert vote when == 0)
 */
export function rateMessage(id: string, vote: number) {
    const message = chat.messages.find(x => x.id === id);
    if (message && message.role === "assistant") {
        message.rating = vote < 0 ? -1 : (vote > 0 ? 1 : 0);
        chat.autoSave();
    }
}

/**
 * Inject keyword with a prompt into the conversation
 * @param keyword Keyword object
 */
export function pushKeyword(keyword: AireKeyword) {
    if (chat.state.keyword_blacklist?.includes(keyword.value))
        return;

    const notification = createKeywordMessage(keyword.value);
    chat.push(notification);

    statistics.sendEvent(new ChatThemeEvent(
        keyword.value,
        chat.id,
        login.user?.uuid,
        statistics.session?.id,
        ChatThemeEventName.ThemeAdded
    ));

    // Create hidden prompt injection
    const prompt = keyword.prompt ?? `The system has identified a topic: ${keyword.value}`
    const promptMessage = createInstructionMessage(prompt);
    chat.push(promptMessage);
}

/**
 * Finds keyword notification message and its injected prompt
 * @param keyword Keyword to remove
 * @param blacklist Set true to prevent keyword from coming back
 */
export function removeKeyword(keyword: string, blacklist: boolean = false) {
    const i = chat.messages
        .findIndex(x => x.type == ChatMessageType.Keyword && x.content == keyword);

    if (i > -1) {
        if (chat.messages.length < i + 1) {
            // Check if the next message is an instruction
            if (chat.messages[i + 1].type == ChatMessageType.Instruction) {
                chat.messages.splice(i + 1, 1);
            }
        }
        chat.messages.splice(i, 1);
    }

    statistics.sendEvent(new ChatThemeEvent(
        keyword,
        chat.id,
        login.user?.uuid,
        statistics.session?.id,
        ChatThemeEventName.ThemeRemoved
    ))

    if (blacklist) {
        chat.state.keyword_blacklist ??= [];
        chat.state.keyword_blacklist.push(keyword);
    }
}

export async function handleKeywordEvent(e: AireTalkKeywords) {

    const currentKeywords = listChatKeywords(chat.messages);
    const newKeywords = e.filter(x => !currentKeywords.includes(x));

    if (newKeywords.length > 0) {
        console.debug("Handling keyword event", e);
        (await updateKeywordMetadata(newKeywords)).forEach(k => pushKeyword(k));

        const inst = createInstructionMessage("New themes detected: " + newKeywords.join(", "));
        chat.push(inst);
    }
    else {
        const inst = createInstructionMessage("No new themes detected. Continue with the conversation.");
        chat.push(inst);
    }

}

export async function handleQuestionnaireEvent(e: AireQuestionnaireEvent) {
    console.debug("Handling questionnaire event", e);

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

        if (best && AireServices.Memory) {
            const result = await AireServices.Memory.getQuestionnaire(best.id);
            if (result.status === AireStatus.Success && result.data) {
                const q = createQuestionnaire(result.data);
                if (q) {
                    useQuestionnaire().startQuestionnaire(q);
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

export async function handleContentSuggestionsEvent(e: AireContentEvent) {
    console.debug("Handling content suggestion event", e);

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

export async function handleReminderEvent(reminder: AireReminder) {
    console.debug("Handling reminder event", reminder);

    statistics.sendEvent(new ReminderEvent(
        reminder.content?.message,
        reminder.trigger_timestamp,
        reminder.chat_id,
        login.user?.uuid,
        statistics.session?.id,
        ReminderEventName.Added
    ));
    const msg = createReminderCreatedMessage(reminder);
    chat.push(msg);

    const inst = createInstructionMessage("A reminder was set successfully.")
    chat.push(inst);
}

let newMessage = false;
export async function handleMessageEvent(message: AireChatbotMessageEvent) {
    let last = chat.messages[chat.messages.length - 1];
    let firstMessage = false // start of the answer stream?

    if (last.role !== "assistant") {
        if (message && message.content.length > 0) {
            last = createAssistantMessage("");
            firstMessage = true
            newMessage = true;
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

export async function handleEndEvent(e: AireChatbotEndEvent) {
    let endConversation = false;

    const message = chat.messages
        .findLast(x =>
            x.role === "assistant" &&
            x.type === ChatMessageType.Default &&
            x.content !== undefined)
    const last = getLastMessage();

    if (message && newMessage) {
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
            useTTS().speak(message.content!);
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

    newMessage = false;
}