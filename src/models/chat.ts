import { AireChatMessage } from "aire";
import { Topic } from "./topic";
import { Questionnaire } from "./questionnaire";

export interface ChatMessage extends AireChatMessage {
    id: string;
    sender: string;
    isError?: boolean;
    localize?: boolean;
}
export interface ChatStats {
    token_count?: number;
}

export interface ChatState {
    questionnaire?: Questionnaire;
    summary?: string;
    keywords?: Array<string>;
    topic?: Topic;
}
