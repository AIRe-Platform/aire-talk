// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { useKeywordCache } from "@/context/cache";
import { AireKeyword, AireServices, AireStatus } from "aire";
import { LanguageCode } from "iso-639-1";

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
