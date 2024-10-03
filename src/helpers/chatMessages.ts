// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.


import useLogin from "@/context/login";
import i18n, { l } from "@/locales";
import { ChatMessage, ChatMessageType } from "@/models/chat";
import { AireChatMessage, AireChatRole, AireQuestionnaireAnswer, AireContent, AireQuestion } from "aire";
import useContent from "@/context/content";

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
        type: ChatMessageType.Default,
        id: newMessageId(),
        sender: sender,
        role: role,
        content: content,
        rating: 0,
        timestamp: Date.now(),
        hidden: hidden,
    }
}


export async function createContentMessage(content: AireContent[]): Promise<ChatMessage> {  
    const msg = createMessage("assistant", l.system_found_content, true, false);

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
    return createMessage("system", message_loc_key, localize, false);
}

export function createErrorMessage(message_loc_key: string): ChatMessage {
    const msg = createSystemMessage(message_loc_key);
    msg.isError = true;
    return msg;
}

export function createAssistantMessage(message: string): ChatMessage {
    return createMessage("assistant", message)
}

export function createInstructionMessage(instructions: string): ChatMessage {
    const msg = createMessage("user", `[INST]${instructions}[/INST]`, false, true);
    msg.type = ChatMessageType.Instruction;
    return msg;
}

export function createNotificationMessage(type: ChatMessageType, content?: string) {
    const msg = createMessage("assistant", content);
    msg.type = type;
    return msg;
}

export function createQuestionnaireMessage(questionnaire_id: string, question: AireQuestion): ChatMessage {
    const msg = createMessage("assistant");
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
    return createMessage("user", message.replaceAll("[", "").replaceAll("]", ""));
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