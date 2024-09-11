// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.


import { reactive } from "vue";
import { ChatMessage } from "@/models/chat";

export class suggestionContext {
    public summary?: string;
    public suggestions?: ChatMessage | null;

    constructor() {

    }

    /**
     * Reset the context
     */
    public reset() {
        this.summary = undefined;
        this.suggestions = undefined;
    }

    /** 
     * Set values
     */
    public set(summary?: string) {
        this.summary = summary;
    }

    /**
     * Set suggestions
     */
    public async setSuggestions(suggestions: ChatMessage) {    
        if(suggestions)
            this.suggestions = suggestions;
    }

    /**
     * Update both summary and keywords
     */
    public async update() {

    }
}

const suggestion = reactive(new suggestionContext());

export default function useSuggestion() {
    return suggestion;
}
