import { AireRole } from "@/services/aire/models/talk";

export interface Answer {
    id: number;
    answer?: string;
    isSelected: boolean;
};

export interface ChatMessage {
    sender: string;
    role: AireRole;
    isError?: boolean;
    timestamp: number;
    title?: string;
    message: string;
    image?: string;
    video?: string;
    question?: string;
    answers?: Answer[];
    isThumbsUp?: boolean;
    isThumbsDown?: boolean;
    messageRate?: number;
    isCopiedClipboard?: boolean;
    isDeletedByUSer?: boolean;

}

export type ChatHistory = Array<ChatMessage>
