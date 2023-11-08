import { CreateChatCompletionRequest } from "./models/CreateChatCompletionRequest";
import { CreateChatCompletionResponse } from "./models/CreateChatCompletionResponse";
import { Role } from "./models/Role";

export interface OpenAIOptions 
{
    frequency_penalty?: number; // [-2.0, 2.0]
    logit_bias?: { [token: string]: number }; // [-100, 100]
    max_tokens?: number;
    n?: number; // [1, 128]
    presence_penalty?: number; // [-2.0, 2.0]
    stop?: string | string[]; // max 4 items
    temparature?: number; // [0.0, 2.0] default: 1.0
    top_p?: number; // [0.0, 1.0] default: 1.0
    user?: string
    stream?: boolean;
}

export interface OpenAIConfig
{
    api_url: string;
    api_key: string;
    model: string;
    system?: string;
    options: OpenAIOptions;
}

export interface OpenAIMessage {
    role: Role;
    content: string;
}

export type OpenAIChatCompletionReceiver = (response: OpenAIMessage | null, final: boolean) => void;

let config: OpenAIConfig;
export function initOpenAI(conf: OpenAIConfig)
{
    config = conf;
}

export async function chatCompletion(messages: Array<OpenAIMessage>, callback: OpenAIChatCompletionReceiver)
{
    const chat: Array<OpenAIMessage> = [];
    if(config.system)
    {
        chat.push({
            content: config.system,
            role: "system"
        })
    }
    chat.push(...messages);

    const data: CreateChatCompletionRequest = {
        messages: chat,
        model: config.model,
        ...config.options
    };

    const url = new URL("/v1/chat/completions", config.api_url)
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + config.api_key
        },
        body: JSON.stringify(data)
    })

    const reader = response.body?.getReader();

    if(reader == null)
    {
        console.warn("Did not receive any response from AI");
        return;
    }

    let done = false;
    while (!done) {
        let value: any = null;
        ({ value, done } = await reader.read());

        if(config.options.stream && !done)
        {
            const responseString = new TextDecoder().decode(value);
            console.log("Full response:", responseString);

            const chunks = responseString
            .split("\n")
            .map(x => {
                if(x.startsWith("data:"))
                {
                    return x.slice(5).trim();
                }
                return x;
            })
            .filter(x => x.length > 0);

            console.log("Stream chunks", chunks);
            chunks.forEach(chunk => handleResponse(chunk, true, callback));
        }
        else
        {
            const responseString = new TextDecoder().decode(value);
            handleResponse(responseString, false, callback);
        }
    }

}

function handleResponse(responseString: string, isStream: boolean, callback: OpenAIChatCompletionReceiver)
{
    let completion: CreateChatCompletionResponse | null = null;
    let message: OpenAIMessage | null = null;
    const final = isStream ? (responseString === "[DONE]") : true;

    if(responseString.length > 0 && (!isStream || !final))
    {
        console.log("Handling chunk:", responseString);

        completion = JSON.parse(responseString);
        if(completion !== null)
        {
            if(completion.choices.length > 0)
            {
                const resp = completion.choices[0];
                const content = (isStream ? resp.delta?.content : resp.message.content);
                const role = (isStream ? resp.delta?.role : resp.message.role);
                if(typeof content === "string")
                {
                    message = {
                        content: content,
                        role: role || "assistant"
                    };
                }
            }
        }
    }
    callback(message, final);
}