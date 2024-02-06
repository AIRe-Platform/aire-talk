import { scrollToMessage } from "@/helpers/scrollToMessage";
import { ChatHistory, ChatMessage } from "@/models/chat";
import { Topic } from "@/models/topic";
import { AireServices } from "@/lib/aire";
import { AireError } from "@/lib/aire/models/error";
import { AireTalkMessage } from "@/lib/aire/models/talk";
import { reactive } from "vue";
import { Login } from "./login";
import i18n from "@/locales";
import { AireChatMessage, AireChatbotInput, AireChatHistory, AireRole, AireChatMetadata } from "@/lib/aire/models/chat";

const bot_name = "aire_bot"
const system_name = "aire_system"

let save_timer_id: number | undefined = undefined;
const SAVE_TIMER_TIMEOUT = 10000;

export interface ChatState {
    chat_id?: string;
    history: ChatHistory;
    awaitingResponse: boolean;
    scrolling: boolean;
    modified: boolean;
    landingInfo?: {
        age: number;
        occupation: string;
    };
    topic?: Topic;
}

export const Chat: ChatState = reactive(initChatState());

/**
 * Sends a message to the chatbot
 * @param message Message content
 */
export function sendChatMessage(message: string) {
    Chat.awaitingResponse = true;

    const userMessage: ChatMessage = {
        id: generateRandomID(),
        sender: getUserName(),
        role: "user",
        title: "",
        message: message,
        image: "",
        rating: 0,
        timestamp: Date.now()
    }

    pushMessage(userMessage)

    if (AireServices.AI) {
        const loc = i18n.global.locale as any;
        const messages = Chat.messages
            .filter(x => x.role === "assistant" || x.role === "user")
            .map(x => {
                const m: AireChatMessage = {
                    role: x.role,
                    content: x.message
                };
                return m;
            })

        const input: AireChatbotInput = {
            chat: messages,
            context: {
                age: Chat.landingInfo?.age,
                occupation: Chat.landingInfo?.occupation,
                topic: Chat.topic?.name,
                language: loc.value
            }
        };

        AireServices.AI.stream(input, receiver, error_handler);
    } else {
        console.warn("AI service is not configured");
    }
}

/**
 * Reverts chat to an earlier state
 * @param id Message ID to revert to
 */
export function revertToMessage(id: number) {
    const index = Chat.history.findIndex(x => x.id === id);
    if (index > -1) {
        Chat.history = Chat.history.slice(0, index + 1);
        startAutoSaveTimer()
    }
    else {
        console.debug("Message not found, cannot revert", id)
    }
}

/**
 * Deletes a chat
 * @param id Chat ID
 */
export async function deleteChat(id: string) {
    console.debug("(removeChat) ,Chat_id ", id);

    if (id == Chat.chat_id)
        await resetChat(true)

    if (AireServices.Memory)
        await AireServices.Memory.deleteChat(id)
}

/**
 * Save the chat in the database.
 * @param chatHistory
 */
export async function saveChat() {
    if (!Login.logged_in || !Chat.modified)
        return

    console.debug("(saveChat) current Chat.chat_id:", Chat.chat_id);
    if (AireServices.Memory) {
        const history: AireChatHistory = await Chat.history.map(x => {
            const m: AireChatMessage = {
                role: x.role,
                content: x.message,
                timestamp: x.timestamp
            };
            return m;
        });
        const history_without_system_messages = history.filter( x => x.role !== "system");//why there is aire_system??

        await AireServices.Memory.saveChat(history_without_system_messages, Chat.chat_id)
            .then(result => {
                if (result)
                    Chat.chat_id = result.id
            })
        Chat.modified = false;
    } else {
        console.warn("MEMORY service is not configured");
    }
}

/**
 * Load the complete chat with the chat_id if it is give. If is not given any chat_id it takes the latest chat saved and put it in the Chat.history.
 * @param chat_id 
 */
export async function loadChat(id?: string) {
    if (Chat.modified)
        await saveChat()

    let chat;
    let chat_id_temp;
    if (AireServices.Memory) {
        if (!id) {
            const chats = await getAllChats();
            if (chats) {
                const latest = chats.sort((b, a) => {
                    return Date.parse(a.time) - Date.parse(b.time)
                })
                chat = await AireServices.Memory.getChat(latest[0].id);
                chat_id_temp = latest[0].id;
            }
        } else {
            chat = await AireServices.Memory.getChat(id);
            chat_id_temp = id;
        }
        if (chat) {
            const history: ChatHistory = await chat.map(x => {
                const m: ChatMessage = {
                    id: generateRandomID(),
                    sender: x.role === "user" ? getUserName() : (x.role === "assistant" ? bot_name : system_name),
                    role: x.role as AireRole,
                    message: x.content,
                    timestamp: x.timestamp || 0,
                };
                return m;
            });
            Chat.history = history;
            Chat.chat_id = chat_id_temp;
        }
    } else {
        console.warn("MEMORY service is not configured");
    }
}

/**
 * Create a new chat
 */
export async function createNewChat() {
    await saveChat();
    resetChat();
}

/**
 * Function to revert the chat state to the chat message passed as param.
 */
export async function resetChat(skip_save: boolean = false) {
    cancelAutoSaveTimer()

    if (!skip_save)
        await saveChat()

    Chat.chat_id = undefined
    Chat.awaitingResponse = false;
    Chat.scrolling = false;
    Chat.modified = false;
    Chat.history = [systemGreeting()]
    Chat.landingInfo = {}
    Chat.checkbox = undefined
    Chat.onboardingFromExternalSite = undefined
}

/**
 * Function that gets all the chats the user has save in the database order from newest to oldest.
 * @returns array of chats format id: string, date: string
 */
// TODO: Export or refactor?
export async function getAllChats(): Promise<AireChatMetadata[]> {
    const chats = await AireServices.Memory?.getChatlogs() || [];
    if (AireServices.Memory) {
        const chatsWithLogs = [];
        for (let i = 0; i < chats.length; i++) {
            const chatMessages = await AireServices.Memory.getChat(chats[i].id);
            chats[i].chatMessages = chatMessages;
        }
    }
    const orderedChats = chats.sort((b, a) => {
        return Date.parse(a.time) - Date.parse(b.time)
    });
    return orderedChats;
}

/**
 * Chatbot answer receiver callback
 * @param msg Message or a part of it
 */
function receiver(msg: AireTalkMessage) {
    let last = Chat.history[Chat.history.length - 1];
    let firstMessage = false // start of the answer stream?

    if (last.role !== "assistant") {
        last = {
            id: generateRandomID(),
            sender: bot_name,
            role: "assistant",
            title: "your answer",
            message: "",
            timestamp: Date.now()
        }
        firstMessage = true
    }

    if (msg && msg.message) {
        last.message += msg.message;
    }
    Chat.awaitingResponse = !msg.final;

    pushMessage(last, firstMessage, msg.final)

    if (!Chat.scrolling || msg.final) {
        Chat.scrolling = true;
        setTimeout(() => {
            scrollToMessage(last, msg.final ? "start" : "end")
            Chat.scrolling = false;
        }, 1000);
    }
}

/**
 * Chatbot error callback
 * @param error Error info
 */
function error_handler(error: AireError) {
    Chat.history.push({
        id: generateRandomID(),
        sender: system_name,
        role: "system",
        isError: true,
        title: error.key || "",
        message: error.key || error.error?.message || "",
        timestamp: Date.now()
    })

    Chat.awaitingResponse = false;
}

/**
 * Build default system greeting message
 * @returns System greeting
 */
function systemGreeting(): ChatMessage {
    return {
        id: generateRandomID(),
        sender: system_name,
        role: "system",
        message: "system_greeting",
        rating: 0,
        timestamp: Date.now()
    };
}

/**
 * Push a new message
 * @param message Message
 * @param create Set to false if you want to modify the last message
 * @param final Set to false to delay triggering auto save
 */
function pushMessage(message: ChatMessage, create: boolean = true, final: boolean = true) {
    if (create) {
        Chat.history.push(message);
    } else {
        Chat.history[Chat.history.length - 1] = message
    }

    if (final)
        startAutoSaveTimer()

    Chat.modified = true
}

/**
 * Initializes chat state object
 */
function initChatState(): ChatState {

    const testMessages: ChatHistory = [
        {
            id: generateRandomID(),
            sender: system_name,
            role: "system",
            message: "system_greeting",
            timestamp: Date.now(),
        }];

    return {
        history: testMessages,
        awaitingResponse: false,
        modified: false,
        scrolling: false,
        landingInfo: {}
    }
}

/**
 * Starts the auto save timer
 */
function startAutoSaveTimer() {
    console.debug("Starting auto save time")
    cancelAutoSaveTimer()

    save_timer_id = setTimeout(async () => {
        save_timer_id = undefined
        console.debug("Auto save triggered!")
        await saveChat()
    }, SAVE_TIMER_TIMEOUT)
}

/**
 * Cancels auto save timer
 */
function cancelAutoSaveTimer() {
    console.debug("Cancelling timer if set") // FIXME: Remove me
    if (save_timer_id)
        clearTimeout(save_timer_id);
    save_timer_id = undefined
}

/**
 * Fucntion to create an ID to the chat messages.
 * @returns a random number
 */
function generateRandomID() {
    return Math.floor(Math.random() * Date.now());
}

/**
 * If user is logged in, returns the user name
 * @returns Name of the user
 */
function getUserName() {
    if (Login.user) {
        return `${Login.user.first_name || ""} ${Login.user.last_name || ""}`.trim();
    }
    return ""
}
