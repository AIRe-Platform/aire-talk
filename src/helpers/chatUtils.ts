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
    AireChatbotInput,
    AireContentEvent,
    AireKeyword,
    AireQuestionnaireEvent,
    AireReminder,
    AireServices,
    AireStatus,
    AireTalkKeywords
} from "aire";
import {
    createContentMessage,
    createControlFlowMessage,
    createInstructionMessage,
    createKeywordMessage,
    createReminderCreatedMessage,
    createSummaryMessage
} from "./chatMessages";
import useChatbot from "@/context/chatbot";
import useContent from "@/context/content";
import { getChatContentIds } from "./contentUtils";
import { createQuestionnaire, queryQuestionnaire } from "./questionnaireUtils";
import useQuestionnaire from "@/context/questionnaire";
import { DateTime } from "luxon";
import { updateKeywordMetadata } from "./keywordUtils";

const chat = useChat();

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
            language: locale
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
    await suggestContent(listChatKeywords(chat.messages));

    const end = createControlFlowMessage(ChatMessageType.EndOfConversation, l.system_end_of_conversation);
    chat.push(end);

    const options = createControlFlowMessage(ChatMessageType.EndOfConversationOptions, l.system_end_of_conversation_options);
    chat.push(options);
}

export function onRejectSummary() {
    const instruction = `
        The user rejected the summary. 
        Ask what is wrong with it and how the user would like to have it modified.
        After that, you should end the conversation with ${ChatMessageTag.END_OF_CONVERSATION_TAG} to create a new summary.
    `;

    const inst = createInstructionMessage(instruction);
    chat.push(inst);
    chat.forceResponse();
}

export async function suggestContent(keywords: string[]): Promise<number> {
    if (chat.state.red_flag_triggered)
        return 0;

    if (keywords.length == 0)
        return 0;

    const q = keywords.sort().join(",");
    if (chat.state.content_queries?.includes(q))
        return 0; // No requeries with the same keys

    useChatbot().makeBusy();

    return await useContent()
        .search(keywords, 4)
        .then(async results => {
            // Filter out already suggested content
            const content = results.filter(x => !getChatContentIds(chat.messages).includes(x.id!));
            if (content.length > 0) {
                const msg = await createContentMessage(content);
                chat.push(msg);

                content.forEach(x => {
                    if (!x.name && !x.description)
                        return;

                    let inst = "A new content suggestion was added to the conversation.";
                    if (x.name)
                        inst = `\nTitle: ${x.name}`;
                    if (x.description)
                        inst = `\nDescription: ${x.description}`;

                    const msg = createInstructionMessage(inst);
                    chat.push(msg);
                })
                return content.length;
            }
            return 0;
        })
        .finally(() => useChatbot().reportReady());
}

export async function onCreatedReminder(reminder: AireReminder) {
    const msg = createReminderCreatedMessage(reminder);
    chat.push(msg);

    const inst = createInstructionMessage("A reminder was set successfully.")
    chat.push(inst);
}

export async function openAndContinueChat(id: string): Promise<boolean> {
    const loaded = await chat.open(id);
    if (!loaded)
        return false;

    const last = getLastMessage();
    if (!last)
        return false;

    if (conversationEnded(chat.messages))
        continueConversation();

    let instruction = "The user has returned to the conversation. Ask about their progress and aim to motivate them.";

    const timeDiff = DateTime.utc().diff(DateTime.fromMillis(last.timestamp!));
    if (timeDiff.isValid)
        instruction += ` It has been ${timeDiff.days} days since you last talked to them.`

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
                const msg = createSummaryMessage(result.data, true);
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

    if (blacklist) {
        chat.state.keyword_blacklist ??= [];
        chat.state.keyword_blacklist.push(keyword);
    }
}

export async function handleKeywordEvent(e: AireTalkKeywords) {
    const currentKeywords = listChatKeywords(chat.messages);
    const newKeywords = e.filter(x => !currentKeywords.includes(x));
    (await updateKeywordMetadata(newKeywords)).forEach(k => pushKeyword(k));

    // TODO: Remove this when the bot is able to suggest questionnaires
    //await chat.queryQuestionnaires(e.keywords);
}

export async function handleQuestionnaireEvent(e: AireQuestionnaireEvent) {
    if (e.results.length > 0) {
        // TODO: Pick suitable
    }
    else {
        const msg = createInstructionMessage("Received content suggestions, but the feature is not yet implemented.")
        chat.push(msg);
    }

    chat.forceResponse();
}

export async function handleContentSuggestionsEvent(e: AireContentEvent) {
    // TODO: Implement
}
