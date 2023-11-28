import { ChatHistory } from "@/models/chat";
import { AireRole } from "./talk";

export interface AireChatbot
{
    name: string;
    description?: string;
}

export interface AireChatMessage
{
    name: string;
    content: string;
}

export interface AireChatbotInput
{
    chat: Array<AireChatMessage>;
}

export interface AireChatbotOutput
{
    content: string;
    type: AireRole;
    example: boolean;
    additional_kwargs: any;
}

export interface AireChatbotErrorEvent
{
    status_code: number;
    message: string;
}

export interface AireChatbotRequest
{
    input: AireChatbotInput;
    config?: object;
    kwargs?: object;
}

export interface AireChatbotResponse
{
    output: AireChatbotOutput;
    callback_events: any[];
    metadata: {
        run_id: string;
    }
}

export enum AireChatbotEventType
{
    Data = "data",
    Error = "error",
    Metadata = "metadata",
    End = "end"
}
