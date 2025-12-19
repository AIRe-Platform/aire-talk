// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.


import { AireKeyword, AireStatus } from "aire";
import { reactive } from "vue";
import { LanguageCode } from "iso-639-1";
import useAireMemory from "./memory";

export class KeywordsContext {
    public metadata: Array<AireKeyword>;

    constructor() {
        this.metadata = new Array<AireKeyword>();
    }

    public async updateMetadata(keywords?: string[]): Promise<AireKeyword[]> {
        const memory = useAireMemory().agentMemory();
        if (!memory) {
            console.warn("Memory service is unavailable for this agent");
            return [];
        }

        if (!keywords || keywords.length == 0) {
            return [];
        }

        const newKeywords = keywords.filter(x => this.metadata.findIndex(k => k.value == x) < 0);
        const results = new Array<AireKeyword>();

        for (let i = 0; i < newKeywords.length; i++) {
            const keyword = newKeywords[i];
            await memory.getKeyword(keyword)
                .then(result => {
                    if (result.status == AireStatus.Success && result.data) {
                        this.metadata.push(result.data);
                        results.push(result.data);
                    }
                    else {
                        console.warn("Could not get information about a keyword", keyword);
                    }
                })
                .catch(err => {
                    console.error("Failed to request keyword information", keyword, err);
                })
        }

        return results;
    }

    public getTranslation(keyword: string, lang: LanguageCode): string | undefined {
        const item = this.metadata.find(x => x.value == keyword);
        if (item) {
            const translation = item.translations?.find(x => x.languageID == lang);
            return translation?.value;
        }
    }

    public getMetadata(keywords: string[]): AireKeyword[] {
        return keywords
            .map(x => this.metadata.find(k => k.value == x))
            .filter(x => x !== undefined);
    }

    public async getKeywords(search?: string): Promise<AireKeyword[] | undefined> {
        const memory = useAireMemory().agentMemory();

        if (!memory) {
            console.warn("Memory service is not available for this agent");
            return undefined;
        }

        // Call the queryKeywords method
        return await memory.queryKeywords(search)
            .then((result) => {
                if (result.status === AireStatus.Success && result.data) {
                    // Assuming you have some caching mechanism or need to return the result
                    return result.data;
                } else {
                    throw new Error(`Failed to get keywords: ${result.status}`);
                }
            })
            .catch((err) => {
                console.error("Failed to get keywords", err);
                return undefined; // Handle the failure case
            });
    }
}


const context = reactive(new KeywordsContext());

export default function useKeywords() {
    return context;
}
