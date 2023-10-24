import { scrollToMessage } from "@/helpers/scrollToMessage";
import { ChatHistory, ChatMessage } from "@/models/chat";
import { AireAI } from "@/services/aire/ai";
import { AireID } from "@/services/aire/id";
import { AireError } from "@/services/aire/models/error";
import { AireIdentity } from "@/services/aire/models/identity";
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

export const bot_name = "aire_bot"
export const system_name = "aire_system"

function initChatState(): ChatState
{
    const id = AireID.getIdentity();
    if(!id)
    {
        throw "No user identity set"
    }

    const state = new ChatState(id, [
        { 
            sender: system_name, 
            type: "system",
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
        type: "user",
        message: message,
        timestamp: Date.now()
    }

    chat.state.history.push(userMessage)

    AireAI.submitChat(message, receiveChatMessage, onReceiveError)
}

function receiveChatMessage(msg: string, final: boolean)
{
    let last = chat.state.history[chat.state.history.length - 1];

    if(last.type !== "bot")
    {
        last = {
            sender: bot_name,
            type: "bot",
            message: "",
            timestamp: Date.now()
        }
        chat.state.history.push(last)
    }

    last.message += msg;
    chat.state.awaitingResponse = !final;

    if(final)
        scrollToMessage(last)
}

function onReceiveError(error: AireError)
{
    chat.state.history.push({
        sender: system_name,
        type: "error",
        message: error.key || error.description || "",
        timestamp: Date.now()
    })

    chat.state.awaitingResponse = false;
}

const chat = {
    state: reactive(initChatState()),
    send: sendChatMessage
};

export default chat;
