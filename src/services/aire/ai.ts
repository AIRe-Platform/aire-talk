import { AireTalkReceiver } from "./talk";
import { AireError, AireErrorHandler, AireErrorKey } from "./models/error";
import { OpenAIMessage, chatCompletion, initOpenAI } from "../openai";
import { ChatHistory } from "@/models/chat";

export const AireAI = {
    submitChat: submitChat
}

function submitChat(chat: ChatHistory, callback: AireTalkReceiver, onError?: AireErrorHandler)
{
    const messages: Array<OpenAIMessage> = chat.map(x => {
        return { role: x.role, content: x.message }
    })

    chatCompletion(messages, callback).catch((reason) => {
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
    api_url: "http://localhost:4891",
    api_key: "tester",
    model: "nous-capybara-7b-v1.9.Q4_K_M.gguf",
    system: `
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
    `,
    options: {
        stream: false,
        max_tokens: 1024
    }
})