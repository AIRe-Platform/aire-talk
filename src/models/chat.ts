import { AireRole } from "@/lib/aire/models/chat";

export interface Answer {
    id: number;
    answer?: string;
    isSelected: boolean;
}

/**
 * TODO refactor isThumDown and up. Use rating.
 * TODO isCOpiedOnClipboard does nothing. remove I think
 */
export interface ChatMessage {
    id: number;
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
    rating?: number;
    isCopiedClipboard?: boolean;
}

export type ChatHistory = Array<ChatMessage>
