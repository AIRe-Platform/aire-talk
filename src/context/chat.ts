import { ChatHistory } from "@/models/chat";
import { AIReID } from "@/services/aire";
import { send } from "@/services/ollama";
import { reactive } from "vue";

class ChatState
{
    public user: string;
    public history: ChatHistory;
    public awaitingResponse: boolean;

    constructor(user: string, history: ChatHistory)
    {
        this.user = user;
        this.history = history;
        this.awaitingResponse = false;
    }
}

function initChatState(): ChatState
{
    const id = AIReID.getIdentity();
    const state = new ChatState(id, [
        { sender: "bot", message: "Hello! How can I help you today?", timestamp: Date.now() },
    ]);
    return state;
}

function sendChatMessage(message: string)
{
    chat.state.awaitingResponse = true;
    const id = AIReID.getIdentity();

    chat.state.history.push({
        sender: id,
        message: message,
        timestamp: Date.now()
    })

    chat.state.history.push({
        sender: "bot",
        message: "",
        timestamp: Date.now()
    })

    send(message, receiveChatMessage);
}

function receiveChatMessage(msg: string, final: boolean)
{
    chat.state.history[chat.state.history.length - 1].message += msg;
    chat.state.awaitingResponse = !final;
}

export const chat = {
    state: reactive(initChatState()),
    send: sendChatMessage
}
