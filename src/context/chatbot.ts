import { reactive } from "vue"

type ChatbotStatus = "idle" | "writing" | "answered";

export class ChatbotContext {
    status: ChatbotStatus;
    private timer?: number;

    constructor() {
        this.status = "idle";
    }

    public setStatus(status: ChatbotStatus, useTimeout: boolean | number = true) {
        const timeout_ms = (typeof useTimeout === 'number') ? useTimeout : 2000;
        this.status = status;

        if (useTimeout) {
            if (this.timer)
                clearTimeout(this.timer);

            if (status !== "idle") {
                this.timer = setTimeout(async () => {
                    this.status = "idle";
                }, timeout_ms);
            }
        }
    }
}

const context = reactive(new ChatbotContext());

export default function useChatbot() {
    return context;
}
