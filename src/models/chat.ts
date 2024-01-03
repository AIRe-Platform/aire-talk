import { AireRole } from "@/services/aire/models/talk";

export interface ChatMessage {
    sender: string;
    role: AireRole;
    isError?: boolean;
    timestamp: number;
    title?: string;
    message: string;
    image?: string;
    video?: string;
}

export type ChatHistory = Array<ChatMessage>
