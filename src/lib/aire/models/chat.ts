export interface AireChatbot {
    name: string;
    description?: string;
}

export interface AireChatMessage {
    role: string;
    timestamp?: number;
    content?: string;
    rating?: number;
}

export interface AireChatInputContext
{
    age?: number;
    occupation?: string;
    topic?: string;
    language: string;
}

export interface AireChatbotInput {
    chat: Array<AireChatMessage>;
    context: AireChatInputContext
}

export interface AireChatbotOutput {
    content: string;
    type: AireRole;
    example: boolean;
    additional_kwargs: any;
}

export interface AireChatbotErrorEvent {
    status_code: number;
    message: string;
}

export enum AireChatbotEventType {
    Data = "data",
    Error = "error",
    Metadata = "metadata",
    End = "end"
}

export type AireRole = "assistant" | "user" | "system";

export type AireChatHistory = Array<AireChatMessage>

export interface AireChatMetadata {
    id: string;
    time: string;
    chatMessages?: AireChatHistory;
}

export interface AireChatAbstract {
    keywords: Array<string>;
    summary: string
}