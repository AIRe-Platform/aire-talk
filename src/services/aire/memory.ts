import { ChatHistory } from "@/models/chat";

export const AireMemory = {
    submitChat: submitChatToMemory,
    getChatHistory: getChatHistoryFromMemory
}

function submitChatToMemory(chat: ChatHistory)
{
    // TODO
    console.warn("Not implemented")
}

function getChatHistoryFromMemory(): Promise<ChatHistory>
{
    return new Promise((resolve, reject) => {
        reject("Not implemented")
    });
}