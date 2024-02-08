import { scrollToMessage } from "@/helpers/scrollToMessage";
import { ChatHistory, ChatMessage } from "@/models/chat";
import { Topic } from "@/models/topic";
import { AireServices } from "@/lib/aire";
import { AireError } from "@/lib/aire/models/error";
import { AireTalkMessage } from "@/lib/aire/models/talk";
import { reactive } from "vue";
import { Login } from "./login";
import { AireChatMessage, AireChatbotInput, AireRole, AireChatMetadata } from "@/lib/aire/models/chat";
import i18n, { l } from "@/locales";

const BOT_NAME = "aire_bot"
const SYSTEM_NAME = "aire_system"

let save_timer_id: number | undefined = undefined;
const SAVE_TIMER_TIMEOUT = 10000;

export interface ChatState {
    id?: string;
    messages: ChatHistory;
    cache: Map<string, ChatHistory>;
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
        console.warn("AI service is unavailable");
    }
}

/**
 * Reverts chat to an earlier state
 * @param id Message ID to revert to
 */
export function revertToMessage(id: number) {
    const index = Chat.messages.findIndex(x => x.id === id);
    if (index > -1) {
        Chat.messages = Chat.messages.slice(0, index + 1)
        Chat.modified = true
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
    console.debug("Deleting chat log", id);

    if (id == Chat.id)
        await resetChatState(true, false)

    if (AireServices.Memory)
        await AireServices.Memory.deleteChat(id)

    clearCache(id)
}

/**
 * Save the chat in the database.
 * @param chatHistory
 */
export async function saveChat() {
    if (!Login.logged_in || !Chat.modified)
        return

    console.debug("Saving chat", Chat.id);

    if (AireServices.Memory) {
        const messages = Chat.messages
            .filter(x => x.role !== "system")
            .map(x => {
                const m: AireChatMessage = {
                    role: x.role,
                    content: x.message,
                    timestamp: x.timestamp,
                    rating: x.rating
                };
                return m;
            });

        await AireServices.Memory.saveChat(messages, Chat.id)
            .then(result => {
                if (result) {
                    setCache(Chat.messages, result.id)
                    Chat.id = result.id
                    Chat.modified = false
                }
            })
    } else {
        console.error("Memory service is unavailable");
    }
}

export async function openChat(id: string): Promise<boolean> {
    if (Chat.id === id)
        return true

    const loaded = await loadChat(id)
    if (!loaded)
        return false

    await resetChatState(false, false)
    Chat.id = id
    Chat.messages = getCache(id)!

    return true
}

/**
 * Checks if the chat log has been cached and retrieves it if not
 * @param id Chat log identifier
 * @param force Force refreshing
 * @returns True if the chat log is present
 */
export async function loadChat(id: string, force: boolean = false): Promise<boolean> {
    if (id in Chat.cache && !force) {
        return true
    }

    console.debug("Loading chat to cache", id)

    if (AireServices.Memory) {
        const chatlog = await AireServices.Memory.getChat(id);
        if (!chatlog)
            return false

        const messages = chatlog.map(x => {
            const m: ChatMessage = {
                id: generateRandomID(),
                sender: x.role === "user" ? getUserName() : (x.role === "assistant" ? BOT_NAME : SYSTEM_NAME),
                role: x.role as AireRole,
                message: x.content,
                timestamp: x.timestamp || 0,
                rating: x.rating || 0
            };
            return m;
        });

        setCache(messages, id)
        return true
    }
    else {
        console.error("Memory service is not available")
        return false
    }
}

/**
 * Create a new chat
 */
export async function createNewChat(topic?: Topic) {
    await resetChatState(false, false);
    if (topic) {
        Chat.topic = topic;

        pushMessage({
            id: generateRandomID(),
            role: "system",
            message: l.system_topic,
            sender: SYSTEM_NAME,
            rating: 0,
            timestamp: Date.now()
        })
    }

}

/**
 * Function to change the rating of the message
 * @param message to change
 * @param rating given by the user
 */
export function setMessageRating(id: number, rating: number) {

    const message = Chat.messages.find(x => x.id === id);
    if (message) {
        message.rating = rating < 0 ? -1 : (rating > 0 ? 1 : 0)
        Chat.modified = true
        startAutoSaveTimer()
    }
}

/**
 * Function that gets all the chats the user has save in the database order from newest to oldest.
 * @returns array of chats format id: string, date: string
 */
export async function getAllChats(): Promise<AireChatMetadata[]> {
    if (AireServices.Memory) {
        const chats = await AireServices.Memory.getChatlogs()
        if (chats) {
            return chats.sort((b, a) => {
                return Date.parse(a.time) - Date.parse(b.time)
            });
        }
    } else {
        console.error("Memory service is not available")
    }
    return []
}

/**
 * Get messages from the chatlog cache
 * @param id Chatlog identifier
 * @returns Messages if loaded, undefined if not present
 */
export function getCache(id: string): ChatHistory | undefined {
    if (id && Chat.cache.has(id))
        return Chat.cache.get(id)
    return undefined
}

/**
 * Set messages into the chatlog cache
 * @param chat Chat history
 * @param id Optional ID, if not given, caches the current chat
 */
function setCache(chat: ChatHistory, id?: string) {
    const key = id || Chat.id
    if (key)
        Chat.cache.set(key, chat)
}

/**
 * Remove a cached chat log
 * @param id Chatlog identifier
 */
function clearCache(id: string) {
    Chat.cache.delete(id)
}

/**
 * Chatbot answer receiver callback
 * @param msg Message or a part of it
 */
function receiver(msg: AireTalkMessage) {
    let last = Chat.messages[Chat.messages.length - 1];
    let firstMessage = false // start of the answer stream?

    if (last.role !== "assistant") {
        last = {
            id: generateRandomID(),
            sender: BOT_NAME,
            role: "assistant",
            title: "your answer",
            message: "",
            timestamp: Date.now(),
            rating: 0
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
    pushMessage({
        id: generateRandomID(),
        sender: SYSTEM_NAME,
        role: "system",
        isError: true,
        title: error.key || "",
        message: error.key || error.error?.message || "",
        timestamp: Date.now(),
        rating: 0
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
        sender: SYSTEM_NAME,
        role: "system",
        message: l.system_greeting,
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
        Chat.messages.push(message);
    } else {
        Chat.messages[Chat.messages.length - 1] = message
    }

    if (final && message.role !== "system") {
        Chat.modified = true
        startAutoSaveTimer()
    }
}

/**
 * Initializes chat state object
 */
function initChatState(): ChatState {
    return {
        messages: [systemGreeting()],
        awaitingResponse: false,
        modified: false,
        scrolling: false,
        cache: new Map,
    }
}

/**
 * Resets the chat state
 * @param skip_save Skips saving current chat, default is false
 * @param clear_cache Set to false, if you don't want to clear the cache
 */
async function resetChatState(skip_save: boolean = false, clear_cache = true) {
    cancelAutoSaveTimer()

    if (!skip_save)
        await saveChat()

    Chat.id = undefined
    Chat.messages = [systemGreeting()]
    Chat.awaitingResponse = false;
    Chat.scrolling = false;
    Chat.modified = false;
    Chat.landingInfo = undefined
    Chat.topic = undefined

    if (clear_cache)
        Chat.cache.clear()
}

/**
 * Starts the auto save timer
 */
function startAutoSaveTimer() {
    cancelAutoSaveTimer()

    save_timer_id = setTimeout(async () => {
        save_timer_id = undefined
        await saveChat()
    }, SAVE_TIMER_TIMEOUT)
}

/**
 * Cancels auto save timer
 */
function cancelAutoSaveTimer() {
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
