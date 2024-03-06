import { scrollChatToBottom } from "@/helpers/scrollToMessage";
import { ChatCache, ChatContext, ChatMessage } from "@/models/chat";
import { Topic } from "@/models/topic";
import {
    AireServices, AireError, AireTalkEvent,
    AireChatMessage, AireChatbotInput, AireRole, AireChatMetadata, AireChatLog,
    AireQuestion, AireQuestionOptionCheckbox, AireQuestionOptionType, AireTokenCount
} from "aire";
import { reactive } from "vue";
import { Login } from "./login";
import i18n, { l } from "@/locales";
import { getUserLanguageCode } from "@/helpers/userLocale";
import { getRelevantQuestions, getUnansweredQuestions } from "@/helpers/questionnaireUtils";
import { LocalizationKey } from "@/locales/keys";
import ChatHistory from "@/components/chat/ChatHistory.vue";

const BOT_NAME = "aire_bot"
const SYSTEM_NAME = "aire_system"

let save_timer_id: number | undefined = undefined;
const SAVE_TIMER_TIMEOUT = 10000;

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
export function revertToMessage(id: string) {
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
    
        let token_count = await getTokensFromChats();

        let chatLog: AireChatLog = {
            messages: messages,
            state: Chat.current,
            stats: {
                token_count: token_count
            }
        }

        console.log({token_count})
        console.log({chatLog})
        console.log(Chat.stats)
        await AireServices.Memory.saveChat(chatLog, Chat.id)
            .then(result => {
                if (result) {
                    setCache({ messages: Chat.messages, state: Chat.current, stats: Chat.stats }, result.id)
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
    console.log(loaded)
    if (!loaded)
        return false

    const cached = getCache(id)!;
    console.log(cached)

    Chat.id = id
    Chat.messages = cached.messages;
    Chat.current = cached.state || {};
    Chat.stats = cached.stats || {};

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
        console.log(chatlog)
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

        setCache({ messages: messages, state: chatlog.state, stats: chatlog.stats }, id)
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
export function setMessageRating(id: string, rating: number) {

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
 * 
 */
export async function getTokensFromChats() : Promise<AireTokenCount | undefined> {

    if (AireServices.AI) {
        return AireServices.AI.token_count(getChatbotInputData())
    }
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
export async function queryAndStartQuestionnaire() {
    if (!Chat.current.keywords || Chat.current.keywords.length < 1)
        return

    if (!AireServices.Memory) {
        console.error("Memory service is not available")
        return
    }

    const questionnaire = await AireServices.Memory.queryQuestionnaire(Chat.current.keywords, getUserLanguageCode())
    if (!questionnaire) {
        return
    }

    const questions = getRelevantQuestions(questionnaire, Chat.current.keywords)
    const unanswered = getUnansweredQuestions(questions, getAnswerObjects(questionnaire.id))

    if (unanswered.length === 0) {
        return
    }

    Chat.current.questionnaire = {
        active_id: questionnaire.id,
        question_queue: questions,
        completed: false
    };

    // Ask user if they want to start a questionnaire
    pushQuestion({
        id: generateRandomID(),
        prompt: "",
        question: i18n.global.t(l.confirm_questionnaire_start, [questionnaire.name]),
        type: AireQuestionOptionType.Checkbox,
        required: true,
        options: {
            multiselect: false,
            values: [
                i18n.global.t(l.button_accept),
                i18n.global.t(l.button_cancel)
            ]
        } as AireQuestionOptionCheckbox
    }, "system", (ans: string[]) => {
        if (ans.includes(i18n.global.t(l.button_accept)))
            pushNextQuestion();
        else
            Chat.current.questionnaire = undefined
    })
}

/**
 * Set questionnaire answer
 * @param message_id 
 * @param answer 
 */
export function answerQuestion(message_id: string, answer: any) {
    const i = Chat.messages.findIndex(x => x.id === message_id);
    if (i > -1) {
        const unanswered = (Chat.messages[i].question?.answer === undefined);

        if (Chat.messages[i].question) {
            Chat.messages[i].question!.answer = answer
            Chat.modified = true;
        }

        startAutoSaveTimer();

        if (Chat.messages[i].questionCallback)
            Chat.messages[i].questionCallback!(answer);
        else if (unanswered)
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
    if (!Chat.current.questionnaire || !Chat.current.questionnaire.completed)
        return false;

    if (AireServices.AI && AireServices.Memory) {
        const answers = getAnswerObjects(Chat.current.questionnaire.active_id)

        const results = await AireServices.AI.processQuestionnaire(
            Chat.current.questionnaire.active_id, answers)

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
function receiver(e: AireTalkEvent) {
    if (e.type === "keywords") {
        onReceiveKeywords(e.keywords || [])
        return;
    }

    if (e.type === "message" || e.type === "end") {
        const final = (e.type === "end");
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

        if (e.message) {
            last.message += e.message.content;
        }
        Chat.awaitingResponse = !final;

        pushMessage(last, firstMessage, final)
    }
}

/**
 * Chatbot error callback
 * @param error Error info
 */
function errorHandler(error: AireError) {
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
 * Handles received keywords
 * @param keywords List of keywords
 */
function onReceiveKeywords(keywords: string[]) {
    const current = Chat.current.keywords || []
    const diff = keywords.filter(x => !current.includes(x))

    // If the keywords contain 2 or more new words,
    // automatically query suitable questionnaires
    if (diff.length > 1) {
        queryAndStartQuestionnaire();
    }

    Chat.current.keywords = keywords
}

/**
 * Build default system greeting message
 * @returns System greeting
 */
function pushSystemMessage(messageKey: LocalizationKey) {
    Chat.messages.push({
        id: generateRandomID(),
        sender: SYSTEM_NAME,
        role: "system",
        message: messageKey,
        rating: 0,
        timestamp: Date.now()
    });
    scrollChatToBottom();
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
 * Pushes a question object into the chat view
 * @param question Question object
 * @param questionnaire_id Optional questionnaire ID, generates random ID if not set
 */
function pushQuestion(question: AireQuestion, questionnaire_id?: string, callback?: (answer: any) => void) {
    const item: ChatMessage = {
        id: generateRandomID(),
        sender: SYSTEM_NAME,
        role: "assistant",
        rating: 0,
        timestamp: Date.now(),
        question: {
            questionnaire_id: questionnaire_id || generateRandomID(),
            question_id: question.id,
            type: question.type,
            question: question.question,
            prompt: question.prompt,
            options: question.options
        },
        questionCallback: callback
    };

    pushMessage(item);
}

/**
 * Push next question from questionnaire question queue
 * @returns Returns false if the questionnaire has been completed or there's none.
 */
function pushNextQuestion(): boolean {
    if (!Chat.current.questionnaire)
        return false

    const next = Chat.current.questionnaire.question_queue.shift()
    if (!next) {
        pushQuestion({
            id: Chat.current.questionnaire.active_id + "_completion",
            question: i18n.global.t(l.confirm_questionnaire_completion),
            type: AireQuestionOptionType.Checkbox,
            required: true,
            prompt: "",
            options: {
                multiselect: false,
                values: [i18n.global.t(l.button_continue)]
            } as AireQuestionOptionCheckbox,
        }, "system", () => {
            sendQuestionnaireAnswers()
        })

        Chat.current.questionnaire.completed = true;
        return false;
    }

    pushQuestion(next, Chat.current.questionnaire.active_id)
    return true;
}

/**
 * Constructs chatbot input data structure
 * @returns Input data for chatbot
 */
function getChatbotInputData(): AireChatbotInput {
    const locale = getUserLanguageCode()
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
            language: locale
        }
    };

    return input;
}

/**
 * Get answers from the current chat messages
 * @param questionnaire_id Questionnaire ID
 * @returns List of answer objects
 */
function getAnswerObjects(questionnaire_id: string) {
    return Chat.messages
        .filter(x => x.question && questionnaire_id === x.question.questionnaire_id)
        .map(x => x.question!)
}

/**
 * Initializes chat state object
 */
function initChatState(): ChatContext {
    return {
        messages: [],
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

    Chat.id = undefined;
    Chat.messages = [];
    Chat.awaitingResponse = false;
    Chat.modified = false;
    Chat.landingInfo = undefined;
    Chat.current = {};

    pushSystemMessage(l.system_greeting)
}

function getResponse() {
    if (AireServices.AI) {
        Chat.awaitingResponse = true;
        const input = getChatbotInputData()
        AireServices.AI.stream(input, receiver, errorHandler);
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
function generateRandomID(): string {
    return Math.floor(Math.random() * Date.now()).toString()
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
