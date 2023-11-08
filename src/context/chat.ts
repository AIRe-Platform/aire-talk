import { scrollToMessage } from "@/helpers/scrollToMessage";
import { ChatHistory, ChatMessage } from "@/models/chat";
import { AireAI } from "@/services/aire/ai";
import { AireID } from "@/services/aire/id";
import { AireError } from "@/services/aire/models/error";
import { AireIdentity } from "@/services/aire/models/identity";
import { AireTalkMessage } from "@/services/aire/talk";
import { reactive } from "vue";

class ChatState
{
    public user: AireIdentity;
    public history: ChatHistory;
    public awaitingResponse: boolean;

    constructor(user: AireIdentity, history: ChatHistory)
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
    const id = AireID.getIdentity();
    if(!id)
    {
        throw Error("No user identity set")
    }

    const state = new ChatState(id, [
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

    const userMessage: ChatMessage = {
        sender: chat.state.user.first_name + " " + chat.state.user.last_name,
        role: "user",
        message: message,
        timestamp: Date.now()
    }

    chat.state.history.push(userMessage)
    const messages = chat.state.history
        .filter(x => x.role === "assistant" || x.role === "user")

    AireAI.submitChat(messages, receiveChatMessage, onReceiveError)
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
