import useChat from "@/context/chat";
import { getUILanguage } from "@/locales";
import { AireChatMessage, AireChatMetadata, AireChatStats, AireChatbotInput, AireServices } from "aire";

/**
 * Function that gets all the chats the user has save in the database order from newest to oldest.
 * @returns array of chats format id: string, date: string
 */
export async function getAllChats(): Promise<AireChatMetadata[]> {
    if (AireServices.Memory) {
        const result = await AireServices.Memory.getChatlogs()
        if (result.data) {
            return result.data.sort((b, a) => {
                return Date.parse(a.time) - Date.parse(b.time)
            });
        }
    } else {
        console.error("Memory service is not available")
    }
    return []
}

/**
 * Send the current chat to AI to get statistics
 * @returns Token count
 */
export async function getChatStats(): Promise<AireChatStats | undefined> {
    if (AireServices.AI) {
        const input = getChatbotInputData();
        return (await AireServices.AI.getChatStats(input)).data
    }
}

/**
 * Constructs chatbot input data structure
 * @returns Input data for chatbot
 */
export function getChatbotInputData(): AireChatbotInput {
    const chat = useChat();
    const locale = getUILanguage();

    const messages = chat.messages
        .filter(x => x.role === "assistant" || x.role === "user")
        .map(x => {
            const m: AireChatMessage = x;
            return m;
        })

    const input: AireChatbotInput = {
        chat: messages,
        context: {
            age: chat.meta.age,
            occupation: chat.meta.occupation,
            topic: chat.meta.topic?.name,
            language: locale
        }
    };

    return input;
}
