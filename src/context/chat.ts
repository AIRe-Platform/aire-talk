import { scrollToMessage } from "@/helpers/scrollToMessage";
import { ChatHistory, ChatMessage } from "@/models/chat";
import { AireServices } from "@/lib/aire";
import { AireError } from "@/lib/aire/models/error";
import { AireTalkMessage } from "@/lib/aire/models/talk";
import { reactive } from "vue";
import { Login } from "./login";
import i18n from "@/locales";
import { AireChatMessage, AireChatbotInput } from "@/lib/aire/models/chat";

const bot_name = "aire_bot"
const system_name = "aire_system"

export interface ChatState
{
    history: ChatHistory;
    awaitingResponse: boolean;
    scrolling: boolean;

    send: (message: string) => void;
    reset: (to_message?: number) => void;
}

export const Chat: ChatState = reactive(initChatState());

function sendChatMessage(message: string)
{
    Chat.awaitingResponse = true;

    const makeName = () => {
        if(Login.user)
        {
            return `${Login.user.first_name || ""} ${Login.user.last_name || ""}`.trim();
        }
        return ""
    }

    const userMessage: ChatMessage = {
        sender: makeName(),
        role: "user",
        message: message,
        timestamp: Date.now()
    }

    Chat.history.push(userMessage)
    const messages = Chat.history
        .filter(x => x.role === "assistant" || x.role === "user")

    if(AireServices.AI)
    {
        const loc = i18n.global.locale as any;
        const input: AireChatbotInput = {
            chat: messages.map(x => {
                const m: AireChatMessage = {
                    role: x.role,
                    content: x.message
                };
                return m;
            }),
            ui_lang: loc.value
        };

        AireServices.AI.stream(input, receiver, error_handler);
    }
    else
    {
        console.warn("AI service is not configured");
    }
}

function receiver(msg: AireTalkMessage)
{
    let last = Chat.history[Chat.history.length - 1];

    if(last.role !== "assistant")
    {
        last = {
            sender: bot_name,
            role: "assistant",
            message: "",
            timestamp: Date.now()
        }
        Chat.history.push(last)
    }

    if(msg && msg.message)
    {
        last.message += msg.message;
    }
    Chat.awaitingResponse = !msg.final;

    if(!Chat.scrolling || msg.final)
    {
        Chat.scrolling = true;
        setTimeout(() => {
            scrollToMessage(last, msg.final ? "start" : "end")
            Chat.scrolling = false;
        }, 1000);
    }
}

function error_handler(error: AireError)
{
    Chat.history.push({
        sender: system_name,
        role: "system",
        isError: true,
        message: error.key || error.error?.message || "",
        timestamp: Date.now()
    })

    Chat.awaitingResponse = false;
}

function systemGreeting() : ChatMessage
{
    return { 
        sender: system_name,
        role: "system",
        message: "system_greeting", 
        timestamp: Date.now()
    };
}

function initChatState(): ChatState
{
    return {
        history: [ systemGreeting() ],
        awaitingResponse: false,
        scrolling: false,
        send: sendChatMessage,
        reset: resetChatState
    }
}

function resetChatState(to_message?: number)
{
    console.debug("Resetting chat state");

    Chat.awaitingResponse = false;
    Chat.scrolling = false;

    let spliceStart = 0;

    if(to_message)
    {
        const index = Chat.history.findIndex(x => x.timestamp === to_message);
        if(index > 0)
            spliceStart = index;
    }
    
    Chat.history = Chat.history.slice(0, spliceStart);
    console.debug(Chat, spliceStart);

    if(Chat.history.length === 0)
        Chat.history.push(systemGreeting());
}
