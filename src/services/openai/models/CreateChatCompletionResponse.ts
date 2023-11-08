import { Role } from "./Role";

export interface ChatCompletionResponseMessage
{
    content: string | null;
    function_call?: {
        arguments: any;
        name: string;
    };
    role?: Role;
}

export interface CompletionUsage 
{
    completion_tokens: number;
    prompt_tokens: number;
    total_tokens: number;
}

export interface CreateChatCompletionResponse
{
    id: string;
    choices: Array<{
        finish_reason: "length" | "stop" | "content_filter" | "function_call" | null;
        index: number;
        message: ChatCompletionResponseMessage,
        delta?: ChatCompletionResponseMessage
    }>;
    created: number;
    model: string;
    object: string;
    usage?: CompletionUsage;
}
