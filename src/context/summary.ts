// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.


import { getChatbotInputData } from "@/helpers/chatUtils";
import { AireKeyword, AireServices, AireStatus } from "aire";
import { reactive } from "vue";
import useChat from "./chat";
import { ChatMessage } from "@/models/chat";

export class SummaryContext {
    public summary?: string;
    public keywords: Set<AireKeyword>;
    public suggestions?: ChatMessage | null;

    constructor() {
        this.keywords = new Set<AireKeyword>();
    }

    /**
     * Reset the context
     */
    public reset() {
        this.summary = undefined;
        this.keywords.clear();
        this.suggestions = undefined;
    }

    /** 
     * Set values
     */
    public set(summary?: string) {
        this.summary = summary;
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
            .then(async (result) => {
                if (result.data) {
                    const keywordsArray = result.data;
                    await this.getKeywordsTranslations(keywordsArray);
                    
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
     * Update the keywords
     */
    public async getKeywordsTranslations(keywordsArray: string[]) {
       
        let combinedKeywords = "";

        if (!AireServices.Memory) {
            console.warn("Memory service is unavailable");
            return;
        }
        combinedKeywords = Array.from(keywordsArray).join(", ");
       
        // Only query the Memory service if there are valid keywords
        if (combinedKeywords) {
            try {
                const memoryResult = await AireServices.Memory.queryKeywords(combinedKeywords);
                
                if (memoryResult.status == AireStatus.Success && memoryResult.data) {
                    this.keywords = new Set(memoryResult.data);
                } else {
                    console.error(`Memory service failed with status: ${memoryResult.status}`);
                }

            } catch (err) {
                console.error("Failed to query keywords from memory", err);
            }
        } else {
            console.warn("No keywords generated to query in Memory service");
        }
    }

    /**
     * Set suggestions
     */
    public async setSuggestions(suggestions: ChatMessage) {
    
        let combinedKeywords = "";

        if (!AireServices.Memory) {
            console.warn("Memory service is unavailable");
            return;
        }
        if(suggestions){
            this.suggestions = suggestions;
            console.log("this.suggestions successfully saved: ", this.suggestions);
        }   
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
                    this.getKeywordsTranslations(result.data?.keywords);
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
