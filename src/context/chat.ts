import { scrollToMessage } from "@/helpers/scrollToMessage";
import { ChatHistory, ChatMessage } from "@/models/chat";
import { Services } from "@/services/aire";
import { AireError } from "@/services/aire/models/error";
import { AireUser } from "@/services/aire/models/user";
import { AireTalkMessage } from "@/services/aire/models/talk";
import { reactive } from "vue";

const bot_name = "aire_bot"
const system_name = "aire_system"

export interface ChatState
{
    user: AireUser;
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
        return `${Chat.user.first_name || ""} ${Chat.user.last_name || ""}`.trim();
    }

    const userMessage: ChatMessage = {
        sender: makeName(),
        role: "user",
        message: message,
        timestamp: Date.now()
    }

    Chat.history.push(userMessage)
    const messages = Chat.history
        .filter(x => x.role === "ai" || x.role === "user")

    if(Services.AI)
    {
        Services.AI.stream(messages, receiver, error_handler);
    }
    else
    {
        console.warn("AI service is not configured");
    }
}

function receiver(msg: AireTalkMessage)
{
    let last = Chat.history[Chat.history.length - 1];

    if(last.role !== "ai")
    {
        last = {
            sender: bot_name,
            role: "ai",
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

function getChatUser(): AireUser
{
    let user = Services.ID?.User.profile;
    if(!user) // Make anonymous user
    {
        console.debug("Creating anonymous user");
        user = {
            uuid: crypto.randomUUID(),
            email: "",
            verified: false
        }
    }
    else
    {
        console.debug("User chat initialized");
    }
    return user;
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
        user: getChatUser(),
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

    Chat.user = getChatUser();
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
