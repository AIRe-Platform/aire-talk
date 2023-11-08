import { AireTalkReceiver } from "./talk";
import { AireError, AireErrorHandler, AireErrorKey } from "./models/error";
import { ChatHistory } from "@/models/chat";

export const AireAI = {
    submitChat: submitChat
}

/*
 * There are integrations for OpenAI and Ollama for demo and testing purposes.
 *
 * If you wish to run language models locally, I suggest you install Ollama (https://ollama.ai)
 * and then uncomment Ollama code here and comment out OpenAI stuff.
 * Note that the context size for Ollama's conversation context is quite short with current implementation.
 * Expect the LLM to begin hallucinating after a while.
 * 
 * If you are using OpenAI, please change the api_key value to your own.
 */

const system_message = `
Act as a medical advisor.
Your task is to find out what is bothering your patient and provide suggestions.
Do not suggest anything that could worsen the condition of the patient.

Keep your responses short and coherent.
Ask only a single question at a time.
Avoid repeating yourself.
Write clear and professional language.

The user is located in Finland. 
For non-emergencies, people can contact 116 117 for advice and guidance.
For emergencies, people should call 112 to get immediate help.

It is important that you tell your patient that you are a bot.
`;

// // Ollama

// import { initOllama, send } from "../ollama";

// function submitChat(chat: ChatHistory, callback: AireTalkReceiver, onError?: AireErrorHandler)
// {
//     const item = chat[chat.length - 1];
//     const messageCallback = (message: string, final: boolean) => {
//         callback({
//             message: message,
//             role: "assistant",
//             final: final
//         })
//     };

//     send(item.message, messageCallback).catch((reason) => {
//         const e: AireError = { 
//             key: AireErrorKey.AiNotResponding,
//             error: reason
//         }
        
//         if(onError)
//             onError(e)

//         console.error(reason)
//     })
// }

// initOllama({
//     host: "http://localhost:11434/api/generate",
//     model: "mistral-openorca", // see available models: https://ollama.ai/library
//     system: system_message,
//     options: {
//         // Adjust parameters here, like:
//         // "temperature": "0.5",
//         // "num_ctx": "4096"
//     },
//     stream: true
// });

// OpenAI

import { OpenAIMessage, chatCompletion, initOpenAI } from "../openai";

function submitChat(chat: ChatHistory, callback: AireTalkReceiver, onError?: AireErrorHandler)
{
    const messages: Array<OpenAIMessage> = chat.map(x => {
        return { role: x.role, content: x.message }
    })

    const openAICallback = (message: OpenAIMessage | null, final: boolean) => {
        callback({
            role: message?.role,
            message: message?.content,
            final: final
        })
    }

    chatCompletion(messages, openAICallback).catch((reason) => {
        const e: AireError = { 
            key: AireErrorKey.AiNotResponding,
            error: reason
        }
        
        if(onError)
            onError(e)

        console.error(reason)
    });
}

initOpenAI({
    api_url: "https://api.openai.com",
    api_key: "<insert your api key here>",
    model: "gpt-3.5-turbo", // See available models here: https://platform.openai.com/docs/guides/text-generation
    system: system_message,
    options: {
        stream: true,
        max_tokens: 1024
    }
})
