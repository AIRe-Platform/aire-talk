import { scrollChatToBottom } from "@/helpers/scrollToMessage";
import { ChatHistory, ChatMessage } from "@/models/chat";
import { Topic } from "@/models/topic";
import { AireServices } from "@/lib/aire";
import { AireError } from "@/lib/aire/models/error";
import { AireTalkMessage } from "@/lib/aire/models/talk";
import { reactive } from "vue";
import { Login } from "./login";
import { AireChatMessage, AireChatbotInput, AireRole, AireChatMetadata, AireChatLog } from "@/lib/aire/models/chat";
import i18n, { l } from "@/locales";
import { AireQuestion } from "@/lib/aire/models/questionnaire";

const BOT_NAME = "aire_bot"
const SYSTEM_NAME = "aire_system"

let save_timer_id: number | undefined = undefined;
const SAVE_TIMER_TIMEOUT = 10000;

export interface QuestionnaireState {
    active_id: string;
    question_queue: Array<AireQuestion>;
    completed: boolean;
}

export interface ChatState {
    topic?: Topic;
    summary?: string;
    keywords?: Array<string>;
    questionnaire?: QuestionnaireState;
}

export interface ChatCache {
    messages: ChatMessage[]
    state?: ChatState
}

export interface ChatContext {
    id?: string;
    messages: ChatHistory;
    cache: Map<string, ChatCache>;
    awaitingResponse: boolean;
    modified: boolean;
    current: ChatState;

    landingInfo?: {
        age: number;
        occupation: string;
    };
}

export const Chat: ChatContext = reactive(initChatState());

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
        message: message,
        rating: 0,
        timestamp: Date.now()
    }

    pushMessage(userMessage)
    getResponse()
}

/**
 * Refreshes the current chat's summary
 */
export async function refreshSummary() {
    Chat.awaitingResponse = true;

    if (AireServices.AI) {
        const input = getChatbotInputData();
        await AireServices.AI.generateSummary(input)
            .then((result) => {
                if (result) {
                    Chat.current.summary = result;
                    startAutoSaveTimer();
                } else {
                    console.warn("There is no generated summary.")
                }
            })
    } else {
        console.warn("AI service is unavailable");
    }
    Chat.awaitingResponse = false;
}

/**
 * Refreshes the current chat's keyword
 * @param addRandomness 
 */
export async function refreshKeywords(addRandomness: boolean) {
    Chat.awaitingResponse = true;

    if (AireServices.AI) {
        const input = getChatbotInputData();
        await AireServices.AI.generateKeywords(input, addRandomness)
            .then((result) => {
                if (result) {
                    const keywords: Array<string> = [];
                    for (let i = 0; i < result.length; i++) {
                        keywords.push(result[i]);
                    }
                    Chat.current.keywords = keywords;
                    startAutoSaveTimer();
                } else {
                    console.warn("There is no generated abstract.")
                }
            })
    } else {
        console.warn("AI service is unavailable");
    }
    Chat.awaitingResponse = false;
}

/**
 * Refreshes the current chat's summary and keywords
 */
export async function refreshAbstract() {
    Chat.awaitingResponse = true;

    if (AireServices.AI) {
        const input = getChatbotInputData();
        await AireServices.AI.generateAbstract(input)
            .then((result) => {
                if (result) {
                    Chat.current.keywords = result.keywords;
                    Chat.current.summary = result.summary;
                    return result;
                } else {
                    console.warn("There is no generated abstract.")
                }
            })
    } else {
        console.warn("AI service is unavailable");
    }
    Chat.awaitingResponse = false;
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
        Chat.current.questionnaire = undefined;
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
            .map(x => {
                const m: AireChatMessage = {
                    role: x.role,
                    content: x.message,
                    timestamp: x.timestamp,
                    rating: x.rating,
                    question: x.question,
                    hidden: x.hidden
                };
                return m;
            });

        const chatLog: AireChatLog = {
            messages: messages,
            state: Chat.current
        }

        await AireServices.Memory.saveChat(chatLog, Chat.id)
            .then(result => {
                if (result) {
                    setCache({ messages: Chat.messages, state: Chat.current }, result.id)
                    Chat.id = result.id
                    Chat.modified = false
                }
            })
    } else {
        console.error("Memory service is unavailable");
    }
}

/**
 * Open a chat
 * @param id Chat identifier
 * @returns True if the chat was opened successfully
 */
export async function openChat(id: string): Promise<boolean> {
    if (Chat.id === id)
        return true

    await resetChatState(false, false)

    const loaded = await loadChat(id)
    if (!loaded)
        return false

    const cached = getCache(id)!;

    Chat.id = id
    Chat.messages = cached.messages;
    setChatState(cached.state || {})

    scrollChatToBottom()
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

    if (AireServices.Memory) {
        const chatlog = await AireServices.Memory.getChat(id);
        if (!chatlog)
            return false

        const messages = chatlog.messages.map(x => {
            const m: ChatMessage = {
                id: generateRandomID(),
                sender: x.role === "user" ? getUserName() : (x.role === "assistant" ? BOT_NAME : SYSTEM_NAME),
                role: x.role as AireRole,
                message: x.content,
                timestamp: x.timestamp || 0,
                rating: x.rating || 0,
                question: x.question,
                hidden: x.hidden
            };
            return m;
        });

        setCache({ messages: messages, state: chatlog.state }, id)
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
        Chat.current.topic = topic;

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
export function getCache(id: string): ChatCache | undefined {
    if (id && Chat.cache.has(id))
        return Chat.cache.get(id)
    return undefined
}

/**
 * Query questionnaires with current keywords and start a questionnaire
 * @returns Boolean to indicate whether the questionnaire was found and started
 */
export async function queryAndStartQuestionnaire(): Promise<boolean> {
    if (!Chat.current.keywords || Chat.current.keywords.length < 1)
        return false;

    if (AireServices.Memory) {
        const questionnaire = await AireServices.Memory.queryQuestionnaire(Chat.current.keywords)
        if (questionnaire) {
            // TODO: Check for saved answers

            // Pick relevant questions from the questionnaire
            const questions = questionnaire.content.flatMap(x => {
                let match_content = x.keywords === undefined;
                if (x.keywords)
                    x.keywords.forEach(k => match_content = Chat.current.keywords?.includes(k) || match_content)

                if (match_content) {
                    return x.questions.filter(q => {
                        let match_question = q.keywords === undefined;
                        if (q.keywords)
                            q.keywords.forEach(k => match_question = Chat.current.keywords?.includes(k) || match_content)
                        return match_question
                    })
                }
                return []
            })

            if (questions.length === 0) {
                console.warn("This questionnaire does not have suitable questions")
                return false;
            }

            // Add questions to queue and push first question to chat
            Chat.current.questionnaire = {
                active_id: questionnaire.id,
                question_queue: questions,
                completed: false
            };
            return pushNextQuestion();
        }
    } else {
        console.error("Memory service is not available")
    }
    return false
}

/**
 * Set questionnaire answer
 * @param message_id 
 * @param answer 
 */
export async function answerQuestion(message_id: number, answer: any) {
    const i = Chat.messages.findIndex(x => x.id === message_id);
    if (i > -1) {
        if (Chat.messages[i].question) {
            Chat.messages[i].question!.answer = answer
            Chat.modified = true;
        }

        startAutoSaveTimer();
        pushNextQuestion();
    }
    else {
        console.warn("Did not find the question message or the message is not a question");
    }
}

/**
 * Sends questionnaire answers to the AI for processing and saves results
 * in the memory. Processed prompts are added to the chat context
 */
export async function sendQuestionnaireAnswers(): Promise<boolean> {
    if (!Chat.current.questionnaire?.completed)
        return false;

    if (AireServices.AI && AireServices.Memory) {
        const answers = Chat.messages
            .filter(x => x.question && x.question && x.question)
            .map(x => x.question!)

        const results = await AireServices.AI.processQuestionnaire(
            Chat.current.questionnaire.active_id, answers)

        console.log("Got results", results)

        if (!results)
            return false;

        const saved = await AireServices.Memory.saveQuestionnaireResults(results);
        if (!saved) {
            console.error("Failed to save questionnaire results");
            return false;
        }

        let message: string | undefined;
        if (results.prompts) {
            const facts = results.prompts?.join("\n")
            message = `[The user responded to a questionnaire. Here are the facts:\n${facts}]`
        }
        else {
            message = `[The user responded to a questionnaire. Here is a summary:\n${results.summary}]`
        }

        if (message) {
            const userMessage: ChatMessage = {
                id: generateRandomID(),
                sender: getUserName(),
                role: "user",
                message: message,
                rating: 0,
                timestamp: Date.now(),
                hidden: true
            }

            pushMessage(userMessage)
            getResponse()
        }

        Chat.current.questionnaire = undefined;
        startAutoSaveTimer();
        return true;

    } else {
        console.error("AI service is not available")
    }

    return false;
}

/**
 * Set messages into the chatlog cache
 * @param chat Chat history
 * @param id Optional ID, if not given, caches the current chat
 */
function setCache(chat: ChatCache, id?: string) {
    const key = id || Chat.id
    if (key)
        Chat.cache.set(key, chat)
}

function setChatState(state: ChatState) {
    Chat.current = state
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

    scrollChatToBottom();
}

/**
 * Push next question from questionnaire question queue
 * @returns Returns false if the questionnaire has been completed or there's none.
 */
function pushNextQuestion(): boolean {
    const next = Chat.current.questionnaire?.question_queue.shift()
    if (!next) {
        if (Chat.current.questionnaire)
            Chat.current.questionnaire.completed = true;
        return false;
    }

    const item: ChatMessage = {
        id: generateRandomID(),
        sender: SYSTEM_NAME,
        role: "assistant",
        rating: 0,
        timestamp: Date.now(),
        question: {
            question_id: next.id,
            type: next.type,
            question: next.question,
            prompt: next.prompt,
            options: next.options
        }
    };

    pushMessage(item);
    return true;
}

/**
 * Constructs chatbot input data structure
 * @returns Input data for chatbot
 */
function getChatbotInputData(): AireChatbotInput {
    const loc = i18n.global.locale as any;
    const messages = Chat.messages
        .filter(x => x.role === "assistant" || x.role === "user")
        .map(x => {
            const m: AireChatMessage = {
                role: x.role,
                content: x.message,
                hidden: x.hidden,
                rating: x.rating,
            };
            return m;
        })

    const input: AireChatbotInput = {
        chat: messages,
        context: {
            age: Chat.landingInfo?.age,
            occupation: Chat.landingInfo?.occupation,
            topic: Chat.current.topic?.name,
            language: loc.value
        }
    };

    return input;
}

/**
 * Initializes chat state object
 */
function initChatState(): ChatContext {
    return {
        messages: [systemGreeting()],
        awaitingResponse: false,
        modified: false,
        cache: new Map,
        current: {}
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

    if (clear_cache)
        Chat.cache.clear()

    Chat.id = undefined
    Chat.messages = [systemGreeting()]
    Chat.awaitingResponse = false;
    Chat.modified = false;
    Chat.landingInfo = undefined;
    Chat.current = {};
}

function getResponse() {
    if (AireServices.AI) {
        Chat.awaitingResponse = true;
        const input = getChatbotInputData()
        AireServices.AI.stream(input, receiver, error_handler);
    } else {
        console.warn("AI service is unavailable");
    }
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
