// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.


import useLogin from "@/context/login";
import i18n, { l } from "@/locales";
import { ChatMessage, ChatMessageType } from "@/models/chat";
import { AireChatMessage, AireChatRole, AireQuestionnaireAnswer, AireContent, AireQuestion } from "aire";

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
    hidden: boolean = false): ChatMessage {

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
    }
}

export function createContentMessage(content: AireContent[]): ChatMessage {
    const msg = createMessage(ChatMessageType.Content, "system", l.system_found_content, true, false);
    msg.media = content.map(x => x.id!);
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

export function createSummaryMessage(summary: string) {
    return createMessage(ChatMessageType.Summary, "system", summary);
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
