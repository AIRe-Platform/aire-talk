export interface ChatMessage {
    sender_id: string;
    sender_name: string;
    is_user: boolean;
    timestamp: number;
    message: string;
}

export type ChatHistory = Array<ChatMessage>
