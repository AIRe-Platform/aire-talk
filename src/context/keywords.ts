import { AireKeyword, AireServices, AireStatus } from "aire";
import { reactive } from "vue";
import { LanguageCode } from "iso-639-1";

export class KeywordsContext {
    public metadata: Array<AireKeyword>;

    constructor() {
        this.metadata = new Array<AireKeyword>();
    }

    public async updateMetadata(keywords?: string[]): Promise<AireKeyword[]> {
        if (!AireServices.Memory) {
            console.warn("Memory service is unavailable");
            return [];
        }

        if (!keywords || keywords.length == 0) {
            return [];
        }

        const newKeywords = keywords.filter(x => this.metadata.findIndex(k => k.value == x) < 0);
        const results = new Array<AireKeyword>();

        for(let i = 0; i < newKeywords.length; i++) {
            const keyword = newKeywords[i];
            await AireServices.Memory?.getKeyword(keyword)
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
        if (!AireServices.Memory) {
            console.warn("Memory service is not available");
            return undefined;
        }
    
        // Call the queryKeywords method
        return await AireServices.Memory.queryKeywords(search)
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
