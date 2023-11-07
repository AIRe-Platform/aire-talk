import { Role } from "./Role";

export type ChatCompletionFunctionParameters = { [key: string]: any };

export type ChatCompletionFunctions = Array<{
    description?: string;
    name: string;
    parameters: ChatCompletionFunctionParameters;
}>;

export interface CreateChatCompletionRequestMessage
{
    content: string;
    function_call?: { arguments: string, name: string };
    name?: string;
    role: Role;
}

export interface CreateChatCompletionRequest
{
    messages: Array<CreateChatCompletionRequestMessage>;
    model: string;
    frequency_penalty?: number; // [-2.0, 2.0]
    function_call?: { name: string } | "none" | "auto";
    functions?: ChatCompletionFunctions;
    logit_bias?: { [token: string]: number }; // [-100, 100]
    max_tokens?: number;
    n?: number; // [1, 128]
    presence_penalty?: number; // [-2.0, 2.0]
    stop?: string | string[]; // max 4 items
    stream?: boolean;
    temparature?: number; // [0.0, 2.0] default: 1.0
    top_p?: number; // [0.0, 1.0] default: 1.0
    user?: string
}
