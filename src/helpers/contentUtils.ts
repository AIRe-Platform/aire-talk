import { ChatMessage } from "@/models/chat";

export function getChatContentIds(messages: ChatMessage[]) {
    const content = messages
        .flatMap(x => x.media)
        .filter(x => x !== undefined)
        .map(x => x!);
    return [...new Set(content)];
}
