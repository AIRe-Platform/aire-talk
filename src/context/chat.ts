import { scrollToMessage } from "@/helpers/scrollToMessage";
import { ChatHistory, ChatMessage } from "@/models/chat";
import { Services } from "@/services/aire";
import { AireError } from "@/services/aire/models/error";
import { AireUser } from "@/services/aire/models/user";
import { AireTalkMessage } from "@/services/aire/models/talk";
import { reactive } from "vue";

class ChatState
{
    public user: AireUser | null;
    public history: ChatHistory;
    public awaitingResponse: boolean;

    constructor(user: AireUser | null, history: ChatHistory)
    {
        this.user = user;
        this.history = history;
        this.awaitingResponse = false;
    }
}

const bot_name = "aire_bot"
const system_name = "aire_system"

function initChatState(): ChatState
{
    let user = Services.ID?.User.profile;
    if(!user) // Make anonymous user
    {
        user = {
            uuid: crypto.randomUUID(),
            email: "",
            verified: false
        }
    }

    const state = new ChatState(user, [
        { 
            sender: system_name,
            role: "system",
            message: "system_greeting", 
            timestamp: Date.now()
        },
    ]);
    return state;
}

function sendChatMessage(message: string)
{
    chat.state.awaitingResponse = true;

    const makeName = () => {
        return "";
    }

    const userMessage: ChatMessage = {
        sender: makeName(),
        role: "user",
        message: message,
        timestamp: Date.now()
    }

    chat.state.history.push(userMessage)
    const messages = chat.state.history
        .filter(x => x.role === "assistant" || x.role === "user")

    if(Services.AI === undefined)
    {
        console.warn("AI service is not configured");
        return;
    }

    Services.AI.submitChat(messages, receiveChatMessage, onReceiveError);
}

let scrolling = false;
function receiveChatMessage(msg: AireTalkMessage)
{
    let last = chat.state.history[chat.state.history.length - 1];

    if(last.role !== "assistant")
    {
        last = {
            sender: bot_name,
            role: "assistant",
            message: "",
            timestamp: Date.now()
        }
        chat.state.history.push(last)
    }

    if(msg && msg.message)
    {
        last.message += msg.message;
    }
    chat.state.awaitingResponse = !msg.final;

    if(!scrolling || msg.final)
    {
        scrolling = true;
        setTimeout(() => {
            scrollToMessage(last, msg.final ? "start" : "end")
            scrolling = false;
        }, 1000);
    }
}

function onReceiveError(error: AireError)
{
    chat.state.history.push({
        sender: system_name,
        role: "system",
        isError: true,
        message: error.key || error.error?.message || "",
        timestamp: Date.now()
    })

    chat.state.awaitingResponse = false;
}

const chat = {
    state: reactive(initChatState()),
    send: sendChatMessage
};

export default chat;
