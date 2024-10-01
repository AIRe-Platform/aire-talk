import { AireKeyword, AireServices, AireStatus } from "aire";
import { reactive } from "vue";

export class KeywordsContext {
    public items: Set<AireKeyword>;

    constructor() {
        this.items = new Set<AireKeyword>();
    }

    public async update(keywords?: string[]) {
        if (!AireServices.Memory) {
            console.warn("Memory service is unavailable");
            return;
        }

        if (!keywords || keywords.length == 0) {
            this.items.clear();
            return;
        }

        const query = keywords.join(",");
        try {
            const result = await AireServices.Memory.queryKeywords(query);

            if (result.status == AireStatus.Success && result.data) {
                this.items = new Set(result.data);
            } else {
                console.error(`Failed to get keywords metadata: ${result.status}`);
            }
        } catch (err) {
            console.error("Failed to query keyword metadata from Memory", err);
        }
    }
}


const context = reactive(new KeywordsContext());

export default function useKeywords() {
    return context;
}
