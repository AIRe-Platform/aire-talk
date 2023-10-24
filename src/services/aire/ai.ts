import { AireTalkReceiver } from "./talk";
import { initOllama, send } from "../ollama";
import { AireError, AireErrorHandler, AireErrorKey } from "./models/error";

export const AireAI = {
    submitChat: submitChat
}

function submitChat(message: string, callback: AireTalkReceiver, onError?: AireErrorHandler)
{
    send(message, callback).catch(() => {
        const e: AireError = { key: AireErrorKey.AiNotResponding }
        
        if(onError)
            onError(e)
        else
            console.error(e)
    });
}

initOllama({
    host: "http://localhost:11434/api/generate",
    model: "openhermes2-mistral",
    system: `
        Act as a doctor.
        Your task is to find out what is bothering your patient and provide suggestions.
        Do not suggest anything that could worsen the condition of the patient.
        Keep your responses short and coherent, advancing logically step by step.
    `,
    stream: true
})