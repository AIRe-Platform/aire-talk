import { AireRole } from "@/services/aire/models/talk";

export interface ChatMessage {
    sender: string;
    role: AireRole;
    isError?: boolean;
    timestamp: number;
    message: string;
}

export type ChatHistory = Array<ChatMessage>
