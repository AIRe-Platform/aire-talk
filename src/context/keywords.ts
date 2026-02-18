// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.


import { AireKeyword, AireStatus } from "aire";
import { reactive } from "vue";
import { LanguageCode } from "iso-639-1";
import useAireMemory from "./memory";
import { useKeywordCache } from "./cache";

export class KeywordsContext {
    private cache = useKeywordCache();

    public getCached(keyword: string): AireKeyword | undefined {
        return this.cache.get(keyword)?.keyword;
    }

    public getOrigin(keyword: string): string | undefined {
        return this.cache.get(keyword)?.origin;
    }

    public async updateMetadata(keywords?: string[]): Promise<AireKeyword[]> {
        keywords ??= this.cache.values().map(x => x.keyword.value).toArray();
        const results = new Array<AireKeyword>();
        const mem = useAireMemory();

        for (let i = 0; i < keywords.length; i++) {
            const keyword = keywords[i];
            const metadata = this.cache.get(keyword);
            const sources = metadata ? [mem.get(metadata.origin)] : mem.all();

            for (const memory of sources) {
                if (!memory)
                    continue;

                const found = await memory.getKeyword(keyword)
                    .then(result => {
                        if (result.status == AireStatus.Success && result.data) {
                            this.cache.set(keyword, { origin: memory.id, keyword: result.data });
                            results.push(result.data);
                            return true;
                        }
                        else {
                            console.warn("Could not get information about a keyword", keyword);
                            return false;
                        }
                    })
                    .catch(err => {
                        console.error("Failed to request keyword information", keyword, err);
                        return false;
                    })

                if (found)
                    break;
            }
        }

        return results;
    }

    public getTranslation(keyword: string, lang: LanguageCode): string | undefined {
        const item = this.cache.get(keyword);
        if (item) {
            const translation = item.keyword.translations?.find(x => x.languageID == lang);
            return translation?.value;
        }
    }

    public async queryKeywords(search?: string): Promise<AireKeyword[] | undefined> {
        const sources = useAireMemory().agent();

        return await useAireMemory().aggregate(sources, async memory => {
            return await memory.queryKeywords(search)
                .then((result) => {
                    if (result.status === AireStatus.Success && result.data) {
                        result.data.forEach(x => this.cache.set(x.value, { origin: memory.id, keyword: x }))
                        return result.data;
                    } else {
                        throw new Error(`Failed to get keywords: ${result.status}`);
                    }
                })
                .catch((err) => {
                    console.error("Failed to get keywords", err);
                    return [];
                });
        });
    }
}


const context = reactive(new KeywordsContext());

export default function useKeywords() {
    return context;
}
