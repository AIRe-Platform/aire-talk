import { ChatHistory, ChatMessage } from "@/models/chat";

export interface AIReConfig {
    api_url: string;
    api_key: string;
}

enum ServiceType {
    ID = 'aire_id',
    AI = 'aire_ai',
    Memory = 'aire_memory'
}

interface Service {
    name: string;
    url: string;
    key: string;
}

interface System {
    config: AIReConfig;
    services: { [id in ServiceType]? : Service }
}

//let aire: System = undefined;

export function initAire(config: AIReConfig)
{
    // TODO: Request service configuration from AIRe Services Hub
}

/* AIRe ID  API */
export const AIReID = {
    getIdentity: getIdentity
}

function getIdentity() : string
{
    // TODO
    console.warn("Not implemented")
    return "asd"
}

/* AIRe AI API */
export const AIReAI = {
    submitChat: submitChatToAI
}

function submitChatToAI(chat: ChatHistory): Promise<ChatMessage>
{
    // TODO
    return new Promise((resolve, reject) => {
        reject("Not implemented")
    });
}

/* AIRe Memory API */
export const AIReMemory = {
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