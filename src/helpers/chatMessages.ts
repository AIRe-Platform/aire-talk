// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.


import useContent from "@/context/content";
import useLogin from "@/context/login";
import i18n, { l } from "@/locales";
import { ChatMessage, ChatMessageType } from "@/models/chat";
import { AireChatMessage, AireChatRole, AireQuestionnaireAnswer, AireContent, AireQuestion, AireReminder } from "aire";

const BOT_NAME = "aire_bot"
const SYSTEM_NAME = "aire_system"

export function mapMessage(msg: AireChatMessage): ChatMessage {
    return {
        ...msg,
        id: newMessageId(),
        sender: getSenderName(msg.role),
        type: (msg.type as ChatMessageType) || ChatMessageType.Default,
    };
}

export function createMessage(
    type: ChatMessageType,
    role: AireChatRole,
    message: string | undefined = undefined,
    localize: boolean = false,
    hidden: boolean = false,
    isNewSummary: boolean = false): ChatMessage {

    let sender = "";
    switch (role) {
        case "assistant": sender = BOT_NAME; break;
        case "system": sender = SYSTEM_NAME; break;
        case "user": sender = getUserName(); break;
    }

    let content = message;
    if (localize && content) {
        content = i18n.global.t(content);
    }
        
    return {
        type: type,
        id: newMessageId(),
        sender: sender,
        role: role,
        content: content,
        rating: 0,
        timestamp: Date.now(),
        hidden: hidden,
        isNewSummary: isNewSummary
    }
}

export async function createContentMessage(content: AireContent[]): Promise<ChatMessage> {
        const msg = createMessage(ChatMessageType.Content, "system", l.system_found_content, true, false);

    // Map the media IDs
    msg.media = content.map(x => x.id!);

    // Handle each content item and generate thumbnail URLs
    const thumbnailUrls = await Promise.all(
        content.map(async (x) => {
            // Check if the content item has an id, then fetch the URL
            return x.id ? await useContent().getUrl(x.id) : x.url;
        })
    );

    // Filter out any undefined values from thumbnailUrls
    msg.thumbnail = thumbnailUrls.filter((url): url is string => url !== undefined);

    return msg;
}

export function createSystemMessage(message_loc_key: string, localize: boolean = true): ChatMessage {
    return createMessage(ChatMessageType.Default, "system", message_loc_key, localize, false);
}

export function createErrorMessage(message_loc_key: string): ChatMessage {
    return createMessage(ChatMessageType.Error, "system", message_loc_key, true);
}

export function createAssistantMessage(message: string): ChatMessage {
    return createMessage(ChatMessageType.Default, "assistant", message)
}

export function createInstructionMessage(instructions: string): ChatMessage {
    return createMessage(ChatMessageType.Instruction, "system", `[INST]${instructions}[/INST]`, false, true);
}

export function createKeywordMessage(keyword: string) {
    return createMessage(ChatMessageType.Keyword, "assistant", keyword);
}

export function createSummaryMessage(summary: string, isNewSummary: boolean) {
    return createMessage(ChatMessageType.Summary, "system", summary, false, false, isNewSummary);
}

export function createReminderCreatedMessage(reminder: AireReminder) {
    const msg = createMessage(ChatMessageType.ReminderCreated, "system");
    msg.reminder = reminder;
    return msg;
}

export function createControlFlowMessage(type: ChatMessageType, message_loc_key?: string) {
    const hasMessage = message_loc_key ? true : false;
    return createMessage(type, "system", message_loc_key, hasMessage, !hasMessage);
}

export function createQuestionnaireMessage(questionnaire_id: string, question: AireQuestion): ChatMessage {
    const msg = createMessage(ChatMessageType.Questionnaire, "assistant");
    const item: AireQuestionnaireAnswer = {
        questionnaire_id: questionnaire_id,
        question_id: question.id,
        type: question.type,
        question: question.question,
        prompt: question.prompt,
        options: question.options
    }
    msg.question = item;
    return msg;
}

export function createUserMessage(message: string): ChatMessage {
    const sanitized = message
        .replaceAll("[INST]", "")
        .replaceAll("[/INST]", "");
    return createMessage(ChatMessageType.Default, "user", sanitized);
}

let message_id_idx = 0;
function newMessageId(): string {
    const i = message_id_idx;
    message_id_idx += 1;
    return `message-${i}`;
}

function getUserName() {
    const login = useLogin();
    if (login.user) {
        return `${login.user.first_name || ""} ${login.user.last_name || ""}`.trim();
    }
    return ""
}

function getSenderName(role: string) {
    let sender = "";
    switch (role) {
        case "assistant": sender = BOT_NAME; break;
        case "system": sender = SYSTEM_NAME; break;
        case "user": sender = getUserName(); break;
    }
    return sender;
}