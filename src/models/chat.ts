import { AireRole } from "@/lib/aire/models/chat";
import { AireQuestionnaireAnswer } from "@/lib/aire/models/questionnaire";

export interface ChatMessage {
    id: number;
    sender: string;
    role: AireRole;
    isError?: boolean;
    timestamp: number;
    message?: string;
    image?: string;
    video?: string;
    question?: AireQuestionnaireAnswer;
    rating: number;
    hidden?: boolean;
}

export type ChatHistory = Array<ChatMessage>
