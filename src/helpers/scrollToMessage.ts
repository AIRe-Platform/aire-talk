// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.


import { ChatMessage } from "@/models/chat";

let scroll_timer_id: number | undefined = undefined;
const SCROLL_DELAY = 200;

export function scrollToMessage(message: ChatMessage, pos?: ScrollLogicalPosition) {
    scroll_timer_id = setTimeout(() => {
        if(scroll_timer_id) {
            clearTimeout(scroll_timer_id)
            scroll_timer_id = undefined
        }

        const bubble = document.getElementById(message.id);
    
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
