import { AireRole } from "@/lib/aire/models/chat";

export interface Question {
    id?: number,
    question: string,
    options: Option
}

export type OptionType = "single-select" | "range" | "open" | "multi-select"

export interface Option {
    type: OptionType,
    answers?: Answer[]
}

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
    question?: Question;
    isThumbsUp?: boolean;
    isThumbsDown?: boolean;
    rating?: number;
    isCopiedClipboard?: boolean;
}

export type ChatHistory = Array<ChatMessage>
