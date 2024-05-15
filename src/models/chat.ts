import { AireChatRole } from "aire";
import { AireQuestion, AireQuestionnaireAnswer, AireQuestionnaireResults, Content } from "aire";
import { Topic } from "./topic";

export interface ChatMessage {
    id: string;
    sender: string;
    role: AireChatRole;
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
    content?: Array<Content>;
}

export interface ChatCache {
    messages: ChatMessage[];
    state?: ChatState;
    stats: ChatStats;
}

export interface ChatContext {
    id?: string;
    messages: ChatHistory;
    cache: Map<string, ChatCache>;
    awaitingResponse: boolean;
    hasFinished: boolean;
    modified: boolean;
    current: ChatState;
    stats: ChatStats;
    landingInfo?: {
        age: number;
        occupation: string;
    };
}

export interface ChatStats {
    token_count?: number;
}

export type ChatHistory = Array<ChatMessage>
