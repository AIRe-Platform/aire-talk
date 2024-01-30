import { scrollToMessage } from "@/helpers/scrollToMessage";
import { ChatHistory, ChatMessage } from "@/models/chat";
import { Topic } from "@/models/topic";
import { AireServices } from "@/lib/aire";
import { AireError } from "@/lib/aire/models/error";
import { AireTalkMessage } from "@/lib/aire/models/talk";
import { reactive, ref } from "vue";
import { Login } from "./login";
import i18n from "@/locales";
import { AireChatMessage, AireChatbotInput, AireChatHistory, AireRole, AireChatMetadata } from "@/lib/aire/models/chat";

const bot_name = "aire_bot"
const system_name = "aire_system"
const constant_countdown_timer = 10000;// 30 seconds
const isGoingToSave = ref(false);
const myTimeout = ref<number>();

export interface ChatState {
    history: ChatHistory;
    awaitingResponse: boolean;
    scrolling: boolean;
    landingInfo: {
        age?: number;
        occupation?: string;
    };
    checkbox?: Topic;
    OnboardingFromExternalSite?: Topic;
    chat_id?: string;

    send: (message: string) => void;
    saveChatHistory: () => void;
    loadChatHistory: (chat_id?: string) => void;
    reset: (to_message?: number) => void;
    getAllChats: () => Promise<AireChatMetadata[]>;
    newChat: () => void;
}

/*
 * If the users is logged, returns first_name last_name else ""
 * @returns 
 */
function getUserName() {
    if (Login.user) {
        return `${Login.user.first_name || ""} ${Login.user.last_name || ""}`.trim();
    }
    return ""
}

export const Chat: ChatState = reactive(initChatState());

function sendChatMessage(message: string) {
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

    Chat.history.push(userMessage);

    console.log("menssage sent. start the counter and save...");

    if (isGoingToSave.value)
        myStopFunction();

    isGoingToSave.value = true;
    myTimeout.value = setTimeout(() => Chat.saveChatHistory(), constant_countdown_timer);

    const messages = Chat.history
        .filter(x => x.role === "assistant" || x.role === "user");

    if (AireServices.AI) {
        const loc = i18n.global.locale as any;
        const input: AireChatbotInput = {
            chat: messages.map(x => {
                const m: AireChatMessage = {
                    role: x.role,
                    content: x.message
                };
                return m;
            }),
            ui_lang: loc.value
        };

        AireServices.AI.stream(input, receiver, error_handler);
    } else {
        console.warn("AI service is not configured");
    }
}

function myStopFunction() {
    console.log("myStopFunction");
    clearTimeout(myTimeout.value);
}

/**
 * TODO I think this is not a good name for this function
 * Save the chat in the database.
 * @param chatHistory
 */
async function saveChatHistory() {
    console.log("(saveChatHistory) current Chat.chat_id:", Chat.chat_id);
    if (AireServices.Memory) {
        const history: AireChatHistory = await Chat.history.map(x => {
            const m: AireChatMessage = {
                role: x.role,
                content: x.message,
                timestamp: x.timestamp
            };
            return m;
        });
        await AireServices.Memory.saveChat(history, Chat.chat_id)
            .then(result => {
                if (result)
                    Chat.chat_id = result.id
            })
    } else {
        console.warn("MEMORY service is not configured");
    }
    isGoingToSave.value = false;
}

/**
 * Load the complete chat with the chat_id if it is give. If is not given any chat_id it takes the latest chat saved and put it in the Chat.history.
 * @param chat_id 
 */
async function loadChatHistory(chat_id?: string) {
    let chat;
    let chat_id_temp;
    if (AireServices.Memory) {
        if (!chat_id) {
            const chats = await getAllChats();
            if (chats) {
                const latest = chats.sort((b, a) => {
                    return Date.parse(a.time) - Date.parse(b.time)
                })
                chat = await AireServices.Memory.getChat(latest[0].id);
                chat_id_temp = latest[0].id;
            }
        } else {
            chat = await AireServices.Memory.getChat(chat_id);
            chat_id_temp = chat_id;
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
 * Function that gets all the chats the user has save in the database order from newest to oldest.
 * @returns array of chats format id: string, date: string
 */
async function getAllChats(): Promise<AireChatMetadata[]> {
    const chats = await AireServices.Memory?.getChatlogs() || [];
    const orderedChats = chats.sort((b, a) => {
        return Date.parse(a.time) - Date.parse(b.time)
    });
    return orderedChats;
}

function receiver(msg: AireTalkMessage) {
    let last = Chat.history[Chat.history.length - 1];

    if (last.role !== "assistant") {
        last = {
            id: generateRandomID(),
            sender: bot_name,
            role: "assistant",
            title: "your answer",
            message: "",
            timestamp: Date.now()
        }
        Chat.history.push(last)
    }

    if (msg && msg.message) {
        last.message += msg.message;
    }
    Chat.awaitingResponse = !msg.final;

    if (!Chat.scrolling || msg.final) {
        Chat.scrolling = true;
        setTimeout(() => {
            scrollToMessage(last, msg.final ? "start" : "end")
            Chat.scrolling = false;
        }, 1000);
    }
}

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
        scrolling: false,
        send: sendChatMessage,
        saveChatHistory: saveChatHistory,
        loadChatHistory: loadChatHistory,
        reset: resetChatState,
        getAllChats: getAllChats,
        landingInfo: {},
        newChat: newChat
    }
}

/**
 * Create a new chat
 */
async function newChat() {
    await saveChatHistory();

    Chat.chat_id = undefined;

    resetChatState();
}

/**
 * Function to revert the chat state to the chat message passed as param.
 * @param to_message_id 
 */
function resetChatState(to_message_id?: number) {
    Chat.awaitingResponse = false;
    Chat.scrolling = false;

    let spliceStart = 0;

    if (to_message_id) {
        const index = Chat.history.findIndex(x => x.id === to_message_id);
        if (index > 0)
            spliceStart = index;
    }

    Chat.history = Chat.history.slice(0, spliceStart);
    console.debug(Chat, spliceStart);

    if (Chat.history.length === 0)
        Chat.history.push(systemGreeting());
}

/**
 * Fucntion to create an ID to the chat messages.
 * @returns a random number
 */
function generateRandomID() {
    return Math.floor(Math.random() * Date.now());
}