import { ChatHistory } from "@/models/chat";
import { AIReID } from "@/services/aire";
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
        { sender: "bot", message: "Hello! How can I help you today?", timestamp: Date.now()},
    ]);
    return state;
}

function sendChatMessage(message: string)
{
    console.warn("Sending not implemented", message);

    const id = AIReID.getIdentity();

    chat.state.history.push({
        sender: id,
        message: message,
        timestamp: Date.now()
    })

    chat.state.awaitingResponse = true;
    setTimeout(() => {
        chat.state.awaitingResponse = false;
    }, 2000);
}

export const chat = {
    state: reactive(initChatState()),
    send: sendChatMessage
}
