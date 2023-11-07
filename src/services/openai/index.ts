import { CreateChatCompletionRequest, CreateChatCompletionRequestMessage } from "./models/CreateChatCompletionRequest";
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

        const responseString = new TextDecoder().decode(value);
        if(responseString.length > 0)
        {
            if(responseString === "[DONE]")
            {
                callback(null, true);
                return;
            }

            const responseBody = JSON.parse(responseString) as CreateChatCompletionResponse;
            console.log(responseBody)

            if(responseBody.choices.length > 0)
            {
                const resp = responseBody.choices[0];
                if(typeof resp.message.content === "string")
                {
                    callback({
                        content: resp.message.content,
                        role: resp.message.role
                    }, !(config.options.stream || false));
                }
            }
        }
    }

}
