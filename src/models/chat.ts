export interface ChatMessage {
    sender: string;
    type: "user" | "bot" | "system" | "error";
    timestamp: number;
    message: string;
}

export type ChatHistory = Array<ChatMessage>
