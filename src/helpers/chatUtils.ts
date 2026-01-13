// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import useChat from "@/context/chat";
import { getUILanguage, l } from "@/locales";
import { ChatMessage, ChatMessageType } from "@/models/chat";
import {
    AireAgent,
    AireChatMessage,
    AireChatMetadata,
    AireChatStats,
    AireChatbotInput,
    AireContent,
    AireKeyword,
    AireServices,
    AireStatus
} from "aire";
import {
    createContentMessage,
    createControlFlowMessage,
    createInstructionMessage,
    createKeywordMessage,
    createSummaryMessage
} from "./chatMessages";
import useChatbot from "@/context/chatbot";
import useContent from "@/context/content";
import { getChatContentIds } from "./contentUtils";
import { createQuestionnaire, queryQuestionnaire, queryQuestionnairesForKeyword } from "./questionnaireUtils";
import useQuestionnaire from "@/context/questionnaire";
import { DateTime } from "luxon";
import useStatistics from "@/context/statistics";
import {
    ChatSummaryAcceptEvent,
    ChatThemeEvent,
    ChatThemeEventName,
    ContentEvent,
    ContentEventName,
} from "@/models/statistics";
import useLogin from "@/context/login";
import { useChatCache } from "@/context/cache";
import useAireMemory from "@/context/memory";
import useKeywords from "@/context/keywords";

const statistics = useStatistics();
const chat = useChat();
const login = useLogin();

/**
 * Load all chats and cache chat resources
 */
export async function loadAllChats(): Promise<AireChatMetadata[]> {
    const memory = useAireMemory().platformDefault();
    if (!memory)
        throw Error("Memory service is not available");

    const chatlogs = await memory.getChatlogs()
        .then(result => {
            if (result.data) {
                return result.data.sort((b, a) => (a.time.valueOf() - b.time.valueOf()));
            }
        });

    if (!chatlogs)
        return [];

    const load_tasks = chatlogs.map(x => useChat().load(x));
    await Promise.all(load_tasks);
    
    return chatlogs;
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
        .filter(x =>
            x.role === "assistant" ||
            x.role === "user" ||
            x.type == ChatMessageType.Instruction ||
            x.type == ChatMessageType.Keyword)
        .map(x => {
            const m: AireChatMessage = x;
            return m;
        })

    const input: AireChatbotInput = {
        chat_id: chat.id,
        chat: messages,
        context: {
            language: locale.value,
            themes: chat.state.themes,
            documents: chat.state.documents,
        },
        agent: chat.state.agent
    };

    return input;
}

export function findChatKeywords(messages: ChatMessage[]): string[] {
    return messages
        .filter(x => x.type == ChatMessageType.Keyword && (x.theme || x.content))
        .map(x => (x.theme || x.content)!)
}

export function listKeywordsFromChat(chat_id: string): string[] {
    const chat = useChatCache().get(chat_id);
    if (!chat)
        return [];

    if (chat.state.themes)
        return (chat.state.themes ?? []).map(x => x.value);
    else
        return findChatKeywords(chat.messages);
}

export function listChatKeywords(): string[] {
    if (chat.state.themes)
        return (chat.state.themes ?? []).map(x => x.value);
    else
        return findChatKeywords(chat.messages);
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
    const keywords = listChatKeywords()
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

    const keywords = listChatKeywords().join(',');
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

export async function queryAndStartQuestionnaire(keywords: string[]): Promise<boolean> {
    if (keywords.length > 0) {
        const q = keywords.sort().join(",");
        if (chat.state.questionnaire_queries?.includes(q))
            return false; // No requeries with the same keys

        useChatbot().makeBusy();
        return await queryQuestionnaire(keywords)
            .then(results => {
                for (const result of results) {
                    const memory = useAireMemory().get(result.source);
                    if (!memory)
                        continue;

                    chat.state.questionnaire_queries ??= [];
                    chat.state.questionnaire_queries.push(q);

                    if (result.result) {
                        const q = createQuestionnaire(result.result, memory);
                        if (q) {
                            useQuestionnaire().startQuestionnaire(q);
                            return true;
                        }
                    }
                }
                return false;
            })
            .finally(() => useChatbot().reportReady())
    }
    return false;
}

export async function queryAndStartQuestionnaireWithKeyword(keyword: string): Promise<boolean> {
    useChatbot().makeBusy();
    return await queryQuestionnairesForKeyword(keyword)
        .then(results => {
            const valid = results?.filter(x => x.results.length > 0);
            for (const result of valid) {
                const memory = useAireMemory().get(result.source);
                const questionnaire = result.results.at(0);
                if (!memory || !questionnaire)
                    continue;

                const q = createQuestionnaire(questionnaire, memory);
                if (q) {
                    useQuestionnaire().startQuestionnaire(q);
                    return true;
                }
            }
            return false;
        })
        .finally(() => useChatbot().reportReady())
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

    if (!chat.state.themes)
        chat.state.themes = [];
    chat.state.themes.push(keyword);

    if (keyword.documents) {
        if (!chat.state.documents)
            chat.state.documents = [];

        for (const doc in keyword.documents) {
            if (chat.state.documents.findIndex(x => x.source === doc) < 0) {
                const origin = useKeywords().getOrigin(keyword.value)
                if (origin) {
                    const memory = useAireMemory().get(origin);
                    if (memory) {
                        memory.getDocumentWithId(doc)
                            .then(res => {
                                if (res.data)
                                    chat.state.documents?.push(res.data)
                            })
                    }
                }
            }
        }
    }

    const notification = createKeywordMessage(keyword);
    chat.push(notification);

    statistics.sendEvent(new ChatThemeEvent(
        keyword.value,
        chat.id,
        login.user?.uuid,
        statistics.session?.id,
        ChatThemeEventName.ThemeAdded
    ));
}

/**
 * Finds keyword notification message and its injected prompt
 * @param keyword Keyword to remove
 * @param blacklist Set true to prevent keyword from coming back
 */
export function removeKeyword(keyword: string, blacklist: boolean = false) {
    if (chat.state.themes) {
        const i = chat.state.themes.findIndex(x => x.value === keyword);
        if (i > -1)
            chat.state.themes.splice(i, 1);
    }

    const i = chat.messages.findIndex(x => x.type == ChatMessageType.Keyword && x.content == keyword);
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

export function getCurrentAgent(): AireAgent | undefined {
    const chat = useChat();
    if (chat.state.agent)
        return AireServices.Agents?.find(x => x.name == chat.state.agent);
    else
        return getDefaultAgent();
}

export function getDefaultAgent(): AireAgent | undefined {
    return AireServices.Agents?.at(0);
}
