// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { ChatMessage, ChatState, ChatStats } from "@/models/chat";
import { AireContent } from "aire";
import { reactive } from "vue";

export interface ChatCache {
    messages: ChatMessage[];
    state: ChatState;
    stats: ChatStats;
}

class CacheContext {
    public chatCache: Map<string, ChatCache>;
    public contentCache: Map<string, AireContent>;

    constructor() {
        this.chatCache = new Map<string, ChatCache>();
        this.contentCache = new Map<string, AireContent>();
    }

    public reset() {
        this.chatCache = new Map<string, ChatCache>();
        this.contentCache = new Map<string, AireContent>();
    }
}

const cache = reactive(new CacheContext());

export function useCache() {
    return cache;
}

export function useChatCache() {
    return cache.chatCache;
}

export function useContentCache() {
    return cache.contentCache;
}
