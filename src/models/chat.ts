import { AireRole } from "@/lib/aire/models/chat";

export interface ChatMessage {
    sender: string;
    role: AireRole;
    isError?: boolean;
    timestamp: number;
    message: string;
}

export type ChatHistory = Array<ChatMessage>
