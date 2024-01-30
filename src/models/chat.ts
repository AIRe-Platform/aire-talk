import { AireRole } from "@/lib/aire/models/chat";
import { Question } from "./questionnaire";
export interface Answer {
    question_id: string;
    type?: string;
    min: number;
    max: number;
    question: string;
    prompt: string;
    answer: any;
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
    answer?: Answer;
    isThumbsUp?: boolean;
    isThumbsDown?: boolean;
    rating?: number;
    isCopiedClipboard?: boolean;
}

export type ChatHistory = Array<ChatMessage>
