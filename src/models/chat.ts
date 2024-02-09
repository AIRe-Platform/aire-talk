import { AireRole } from "@/lib/aire/models/chat";
import { QuestionItem } from "./questionnaire";
export interface Answer {
    question_id: string;
    type?: string;
    min: number;
    max: number;
    question: string;
    prompt: string;
    answer: any;
}

export interface ChatMessage {
    id: number;
    sender: string;
    role: AireRole;
    isError?: boolean;
    timestamp: number;
    title?: string;
    message?: string;
    image?: string;
    video?: string;
    questionItem?: QuestionItem;
    answer?: Answer;
    rating: number;
}

export type ChatHistory = Array<ChatMessage>
