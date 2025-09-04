// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { useChatCache, useKeywordCache } from "@/context/cache";
import { AireChatMetadata, AireKeyword, AireServices, AireStatus } from "aire";
import { LanguageCode } from "iso-639-1";
import { getAllChats, listChatKeywords } from "./chatUtils";
import useChat from "@/context/chat";
import { getUILanguage } from "@/locales";


export async function updateKeywordMetadata(keywords?: string[]): Promise<AireKeyword[]> {
    if (!AireServices.Memory) {
        console.warn("Memory service is unavailable");
        return [];
    }

    if (!keywords || keywords.length == 0) {
        return [];
    }

    const cache = useKeywordCache();
    const results = new Array<AireKeyword>();

    for (let i = 0; i < keywords.length; i++) {
        await AireServices.Memory?.getKeyword(keywords[i])
            .then(result => {
                if (result.status == AireStatus.Success && result.data) {
                    cache.set(result.data.value, result.data);
                    results.push(result.data);
                }
                else {
                    console.warn("Could not get information about a keyword", keywords[i]);
                }
            })
            .catch(err => {
                console.error("Failed to request keyword information", keywords[i], err);
            })
    }

    return results;
}

export function getKeywordTranslation(keyword: string, lang: LanguageCode): string | undefined {
    const item = useKeywordCache().get(keyword);
    if (item) {
        const translation = item.translations?.find(x => x.languageID == lang);
        return translation?.value;
    }
}

export function getKeywordMetadata(keywords: string[]): AireKeyword[] {
    const cache = useKeywordCache();
    return keywords
        .map(x => cache.get(x))
        .filter(x => x !== undefined);
}

export async function getAllKeywordsFromHistory(): Promise<AireKeyword[]> {
    const foundKeywords = new Set<string>();

    try {
        const allChats = await getAllChats();
        const loadedChats = await loadChatMessages(allChats, allChats.length);

        if (!Array.isArray(loadedChats)) {
            console.error("Failed to load chat messages.");
            return [];
        }

        loadedChats.forEach(chatLog => {
            if (!chatLog) return;

            const keywords = listChatKeywords();
            keywords.forEach(keyword => foundKeywords.add(keyword));
        });

        const KeywordsMetadata = await updateKeywordMetadata(Array.from(foundKeywords));
        return KeywordsMetadata;

    } catch (error) {
        console.error("Error loading chat keywords:", error);
        return [];
    }
}

export async function translateKeywords(keywords: AireKeyword[]): Promise<string[]> {
    const langID = getUILanguage().value;

    return await Promise.all(
        keywords.map(async (keyword) => {
            const translation = keyword.translations?.find(t => t.languageID === langID);
            return translation ? translation.value : keyword.value;
        })
    );
}

export async function getTranslation(keyword: { value: string; translations?: Array<{ value: string; languageID: string }> }): Promise<string> {
    const langID = await getUILanguage().value;
    const translation = keyword.translations?.find(t => t.languageID === langID);
    return translation ? translation.value : keyword.value;
}

async function loadChatMessages(chatlogs: AireChatMetadata[], amount: number = 3) {
    const loadedChats = chatlogs.slice(0, amount).map(async (x) => {
        if (await useChat().load(x.id))
            return useChatCache().get(x.id);
        else
            return undefined;
    })

    return await Promise.all(loadedChats)
}

