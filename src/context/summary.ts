// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.


import { getChatbotInputData } from "@/helpers/chatUtils";
import { AireKeyword, AireServices, AireStatus } from "aire";
import { reactive } from "vue";
import useChat from "./chat";
import { ChatMessage } from "@/models/chat";
import { i } from "vite/dist/node/types.d-aGj9QkWt";

export class SummaryContext {
    public summary?: string;

    constructor() {
    }

    /**
     * Reset the context
     */
    public reset() {
        this.summary = undefined;
    }

    /** 
     * Set values
     */
    public set(summary?: string) {
        this.summary = summary;
    }

    public async update() {
        if (!AireServices.AI) {
            console.warn("AI service is unavailable");
            return;
        }

        const chat = useChat();
        const input = getChatbotInputData();

        if(input.chat.length == 0) {
            this.summary = undefined;
            return;
        }

        await AireServices.AI.generateSummary(input)
            .then((result) => {
                if (result.data) {
                    this.summary = result.data;
                    chat.autoSave();
                } else {
                    throw Error(result.status.toString());
                }
            })
            .catch((err) => {
                console.error("Failed to refresh summary: ", err);
            })
    }
}

const context = reactive(new SummaryContext());

export default function useSummary() {
    return context;
}
