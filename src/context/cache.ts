// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { ChatMessage, ChatState, ChatStats } from "@/models/chat";
import { AireContent, AireKeyword, AireReminder } from "aire";
import { reactive } from "vue";

export interface ContentCacheItem {
    origin: string;
    content: AireContent;
}

export interface ChatCacheItem {
    messages: ChatMessage[];
    state: ChatState;
    stats: ChatStats;
}

export interface KeywordCacheItem {
    origin: string;
    keyword: AireKeyword;
}

export interface ReminderCacheItem {
    origin: string;
    reminder: AireReminder;
}

class CacheContext {
    public chatCache = new Map<string, ChatCacheItem>();
    public contentCache = new Map<string, ContentCacheItem>();
    public keywordCache = new Map<string, KeywordCacheItem>();
    public reminderCache = new Map<string, ReminderCacheItem>();

    public reset() {
        this.chatCache.clear();
        this.contentCache.clear();
        this.keywordCache.clear();
        this.reminderCache.clear();
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

export function useKeywordCache() {
    return cache.keywordCache;
}

export function useReminderCache() {
    return cache.reminderCache;
}
