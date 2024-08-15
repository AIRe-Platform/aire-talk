// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.


import { getChatbotInputData } from "@/helpers/chatUtils";
import { AireServices } from "aire";
import { reactive } from "vue";
import useChat from "./chat";

export class SummaryContext {
    public summary?: string;
    public keywords: Set<string>;

    constructor() {
        this.keywords = new Set<string>();
    }

    /**
     * Reset the context
     */
    public reset() {
        this.summary = undefined;
        this.keywords.clear();
    }

    /** 
     * Set values
     */
    public set(summary?: string, keywords?: Array<string>) {
        this.summary = summary;
        this.keywords = new Set(keywords);
    }

    /**
     * Update the keywords
     */
    public async updateKeywords() {
        if (!AireServices.AI) {
            console.warn("AI service is unavailable");
            return;
        }

        const chat = useChat();
        const input = getChatbotInputData();

        await AireServices.AI.generateKeywords(input)
            .then((result) => {
                if (result.data) {
                    this.keywords = new Set(result.data);
                    chat.autoSave();
                } else {
                    throw Error(result.status.toString());
                }
            })
            .catch((err) => {
                console.error("Failed to refresh keywords", err);
            });
    }

    /** 
     * Update the summary
     */
    public async updateSummary() {
        if (!AireServices.AI) {
            console.warn("AI service is unavailable");
            return;
        }

        const chat = useChat();
        const input = getChatbotInputData();

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

    /**
     * Update both summary and keywords
     */
    public async update() {
        if (!AireServices.AI) {
            console.warn("AI service is unavailable");
            return;
        }

        const chat = useChat();
        const input = getChatbotInputData();
        await AireServices.AI.generateAbstract(input)
            .then((result) => {
                if (result.data) {
                    this.keywords = new Set(result.data?.keywords);
                    context.summary = result.data?.summary;
                    chat.autoSave();
                } else {
                    throw Error(result.status.toString());
                }
            })
            .catch((err) => {
                console.error("Failed to generate abstract", err)
            })
    }
}

const context = reactive(new SummaryContext());

export default function useSummary() {
    return context;
}
