import { AireChatbotEventType, AireChatbotOutput, AireRole } from "./chat";

export type AireTalkKeywords = string[];

export interface AireTalkEvent {
    type: AireChatbotEventType;
    message?: AireChatbotOutput;
    keywords?: AireTalkKeywords;
}

export type AireTalkReceiver = (event: AireTalkEvent) => void;
