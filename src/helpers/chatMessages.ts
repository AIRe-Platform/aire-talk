import useLogin from "@/context/login";
import i18n, { l } from "@/locales";
import { ChatMessage } from "@/models/chat";
import { AireChatMessage, AireChatRole, AireQuestionnaireAnswer, AireContent, AireQuestion } from "aire";

const BOT_NAME = "aire_bot"
const SYSTEM_NAME = "aire_system"

export function mapMessage(msg: AireChatMessage): ChatMessage {    
    return {
        ...msg,
        id: newMessageId(),
        sender: getSenderName(msg.role),
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

    return {
        id: newMessageId(),
        sender: sender,
        role: role,
        content: (localize && message) ? i18n.global.t(message) : message,
        rating: 0,
        timestamp: Date.now(),
        hidden: hidden
    }
}

export function createContentMessage(content: AireContent[]): ChatMessage {
    const msg = createMessage("assistant", l.system_found_content, true);
    msg.media = content.map(x => x.id!);
    return msg;
}

export function createSystemMessage(message_loc_key: string, localize: boolean = true) : ChatMessage {
    return createMessage("system", message_loc_key, localize);
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
    return createMessage("user", instructions, false, true);
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
    return createMessage("user", message);
}

let message_id_idx = 0;
function newMessageId(): string {
    const i = message_id_idx;
    message_id_idx += 1;
    return i.toString();
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