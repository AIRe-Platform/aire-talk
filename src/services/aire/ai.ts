import { AireTalkReceiver } from "./talk";
import { initOllama, send } from "../ollama";

export const AireAI = {
    submitChat: submitChat
}

function submitChat(message: string, callback: AireTalkReceiver)
{
    send(message, callback)
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