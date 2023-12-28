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
    landingInfo: {
        age?: number;
        occupation?: string;
    };
    checkbox: string;

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
        title: "",
        message: message,
        timestamp: Date.now()
    }

    Chat.history.push(userMessage)
    const messages = Chat.history
        .filter(x => x.role === "assistant" || x.role === "user")

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

    if(last.role !== "assistant")
    {
        last = {
            sender: bot_name,
            role: "assistant",
            title: "your answer",
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
        title:  error.key || "",
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
    const testMessages: ChatHistory = [
        { 
            sender: system_name,
            role: "system",
            message: "system_greeting",
            timestamp: Date.now(),
        },
        { 
            sender: bot_name,
            role: "assistant",
            message: "your age is 19, is that correct?",
            timestamp: Date.now(),
        },
        { 
            sender: "Juan",
            role: "user",
            message: "Yes that is correct. I am close to 20 though",
            timestamp: Date.now(),
        },
        { 
            sender: bot_name,
            role: "assistant",
            message: "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            timestamp: Date.now(),
        },
        { 
            sender: "Juan",
            role: "user",
            message: "orem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
            timestamp: Date.now(),
        },
        { 
            sender: bot_name,
            role: "assistant",
            message: "Yes, I know that. I know everything",
            timestamp: Date.now(),
        },
        { 
            sender: "Juan",
            role: "user",
            message: "You bots...are crazy scary",
            timestamp: Date.now(),
        }
    ];

    return {
        user: getChatUser(),
        history: testMessages,
        awaitingResponse: false,
        scrolling: false,
        send: sendChatMessage,
        reset: resetChatState,
        landingInfo: {},
        checkbox: "",
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
