import { ChatMessage } from "@/models/chat";

export function scrollToMessage(message: ChatMessage)
{
    const id = message.timestamp.toString();
    const bubble = document.getElementById(id);

    if(bubble)
    {
        bubble.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
    else
    {
        console.warn("Could not find message:", message.timestamp)
    }
}
