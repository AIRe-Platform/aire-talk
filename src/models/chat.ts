import { Role } from "@/services/openai/models/Role";

export interface ChatMessage {
    sender: string;
    role: Role;
    isError?: boolean;
    timestamp: number;
    message: string;
}

export type ChatHistory = Array<ChatMessage>
