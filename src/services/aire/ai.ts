import { AireTalkReceiver } from "./talk";
import { initOllama, send } from "../ollama";
import { AireError, AireErrorHandler, AireErrorKey } from "./models/error";

export const AireAI = {
    submitChat: submitChat
}

function submitChat(message: string, callback: AireTalkReceiver, onError?: AireErrorHandler)
{
    send(message, callback).catch((reason) => {
        const e: AireError = { 
            key: AireErrorKey.AiNotResponding,
            error: reason
        }
        
        if(onError)
            onError(e)

        console.error(reason)
    });
}

initOllama({
    host: "http://localhost:11434/api/generate",
    model: "mistral-openorca",
    system: `
        Act as a medical advisor.
        Your task is to find out what is bothering your patient and provide suggestions.
        Do not suggest anything that could worsen the condition of the patient.
        
        Keep your responses short and coherent, advancing logically step by step.
        Avoid repeating or looping your responses.
        Be helpful and friendly.

        The user is located in Finland. 
        For non-emergencies, people can contact 116 117 for advice and guidance.
    `,
    options: {
        //"temperature": "0.5",
        //"num_ctx": "4096"
    },
    stream: true
})