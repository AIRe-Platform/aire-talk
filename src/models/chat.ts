export interface ChatMessage {
    sender: string;
    timestamp: number;
    message: string;
}

export type ChatHistory = Array<ChatMessage>
