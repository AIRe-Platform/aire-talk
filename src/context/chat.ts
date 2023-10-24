import { scrollToMessage } from "@/helpers/scrollToMessage";
import { ChatHistory } from "@/models/chat";
import { AireAI } from "@/services/aire/ai";
import { AireID } from "@/services/aire/id";
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

export const bot_id = "bot"
export const bot_name = "AIRe Bot"

function initChatState(): ChatState
{
    const id = AireID.getIdentity();
    if(!id)
    {
        throw "No user identity set"
    }

    const state = new ChatState(id, [
        { 
            sender_id: bot_id,
            sender_name: bot_name, 
            is_user: false,
            message: "Hello! How can I help you today?", 
            timestamp: Date.now() },
    ]);
    return state;
}

function sendChatMessage(message: string)
{
    chat.state.awaitingResponse = true;

    chat.state.history.push({
        sender_id: chat.state.user.id,
        sender_name: chat.state.user.first_name + " " + chat.state.user.last_name,
        is_user: true,
        message: message,
        timestamp: Date.now()
    })

    chat.state.history.push({
        sender_id: bot_id,
        sender_name: bot_name,
        is_user: false,
        message: "",
        timestamp: Date.now() + 1
    })

    AireAI.submitChat(message, receiveChatMessage)
}

function receiveChatMessage(msg: string, final: boolean)
{
    const last = chat.state.history[chat.state.history.length - 1];
    last.message += msg;

    chat.state.awaitingResponse = !final;

    if(final)
        scrollToMessage(last)
}

const chat = {
    state: reactive(initChatState()),
    send: sendChatMessage
};

export default chat;
