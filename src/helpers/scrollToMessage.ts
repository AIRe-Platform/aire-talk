import { ChatMessage } from "@/models/chat";


let scroll_timer_id: number | undefined = undefined;
const SCROLL_DELAY = 200;

export function scrollToMessage(message: ChatMessage, pos?: ScrollLogicalPosition) {
    scroll_timer_id = setTimeout(() => {
        if(scroll_timer_id) {
            clearTimeout(scroll_timer_id)
            scroll_timer_id = undefined
        }

        const id = message.id.toString();
        const bubble = document.getElementById(id);
    
        if (bubble) {
            bubble.scrollIntoView({
                behavior: "smooth",
                block: pos || "end"
            });
        }
        else {
            console.warn("Could not find message:", message.timestamp)
        }
    }, SCROLL_DELAY)
}

export function scrollChatToBottom() {
    scroll_timer_id = setTimeout(() => {
        if(scroll_timer_id) {
            clearTimeout(scroll_timer_id)
            scroll_timer_id = undefined
        }

        const view = document.getElementById("chat-viewport");
        view?.scrollTo({
            left: 0,
            top: view.scrollHeight,
            behavior: "smooth"
        });
    }, SCROLL_DELAY)
}
