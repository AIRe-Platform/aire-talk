// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.


import { reactive } from "vue";
import { ChatMessage } from "@/models/chat";
import useChat from "./chat";
import useContent from "./content";
import { getChatContentIds } from "@/helpers/contentUtils";
import { createContentMessage } from "@/helpers/chatMessages";

export class SuggestionContext {
    public message?: ChatMessage;

    constructor() {
    }

    public reset() {
        this.message = undefined;
    }

    public async searchContent(keywords: string[]) {
        const messages = useChat().messages;

        let results = await useContent().search(keywords, 4);
        results = results
            .filter(x => !getChatContentIds(messages).includes(x.id!))
            .slice(0, 2);
    
        if (results.length > 0) {
            this.message = createContentMessage(results);
        }
        else {
            this.message = undefined;
        }
    }
}

const suggestion = reactive(new SuggestionContext());

export default function useSuggestion() {
    return suggestion;
}
