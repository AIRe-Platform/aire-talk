import { AireRole } from "@/lib/aire/models/chat";
import { AireQuestion, AireQuestionnaireAnswer, AireQuestionnaireResults } from "@/lib/aire/models/questionnaire";
import { Topic } from "./topic";

export interface ChatMessage {
    id: string;
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
    questionCallback?: (answer: any) => void;
}

export interface QuestionnaireState {
    active_id: string;
    question_queue: Array<AireQuestion>;
    results?: AireQuestionnaireResults;
    completed: boolean;
}

export interface ChatState {
    topic?: Topic;
    summary?: string;
    keywords?: Array<string>;
    questionnaire?: QuestionnaireState;
}

export interface ChatCache {
    messages: ChatMessage[]
    state?: ChatState
}

export interface ChatContext {
    id?: string;
    messages: ChatHistory;
    cache: Map<string, ChatCache>;
    awaitingResponse: boolean;
    modified: boolean;
    current: ChatState;

    landingInfo?: {
        age: number;
        occupation: string;
    };
}

export type ChatHistory = Array<ChatMessage>
