// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.


import { useChatCache } from "@/context/cache";
import { ChatMessage } from "@/models/chat";
import { getAllChats } from "./chatUtils";
import useChat from "@/context/chat";

export function getChatContentIds(messages: ChatMessage[]): string[] {
    const content = messages
        .flatMap(x => x.media)
        .filter(x => x !== undefined)
        .map(x => x!);
    return [...new Set(content)];
}

export async function getAllSuggestedContentFromHistory(): Promise<string[]> {
    const content = new Set<string>();

    const chats = await getAllChats();
    for (const c of chats) {
        await useChat().load(c.id)
        const chat = useChatCache().get(c.id);
        if (chat !== undefined) {
            getChatContentIds(chat.messages).forEach(id => {
                content.add(id);
            })
        }
    }

    return [...content];
}
