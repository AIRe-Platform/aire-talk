// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { AireStatus, AireContent, AireContentType } from "aire";
import { reactive } from "vue";
import { useContentCache } from "./cache";
import useAireMemory from "./memory";
import { getUILanguage } from "@/locales";

export class ContentContext {
    private ratings: Map<string, number> = new Map<string, number>();
    private cache = useContentCache();

    public reset() {
        this.ratings.clear();
    }

    /**
     * Searches content using keywords
     * @param keywords List of keywords
     * @param max_items Maximum number of items to show
     * @returns List of found content, sorted first by rating and then by modification date
     */
    public async search(keywords: string[], max_items: number | undefined): Promise<AireContent[]> {
        const mem = useAireMemory();
        const lang = getUILanguage();
        return await mem.aggregate(mem.agent(), async memory => {
            return await memory.searchContent(keywords, lang.value)
                .then((result) => {
                    if (!result.data) {
                        throw Error(result.status.toString())
                    }

                    const cache = useContentCache();
                    result.data.forEach(x => cache.set(x.id!, { origin: memory.id, content: x }));

                    const results = result.data?.sort((a, b) => {
                        // Sort by rating
                        if (a.score && b.score) {
                            const viewersRatingComparison = b.score - a.score;
                            if (viewersRatingComparison !== 0) {
                                return viewersRatingComparison;
                            }
                        }

                        // Sort by date
                        // Sort by date
                        const aDate = a.modified ? new Date(a.modified).getTime() : 0;  // Use 0 as fallback if undefined
                        const bDate = b.modified ? new Date(b.modified).getTime() : 0;  // Use 0 as fallback if undefined

                        return bDate - aDate;
                    }) || [];

                    if (max_items)
                        return results.slice(0, max_items);

                    return results;

                })
                .catch((err) => {
                    console.error("Failed to refresh content catalogue", err);
                    return [];
                })
        })
    }

    /**
     * Up or down vote the content
     * @param content_id Content identifier
     * @param vote > 0 for an upvote, < 0 for a downvote, 0 to undo vote
     */
    public async vote(content_id: string, vote: number): Promise<boolean> {
        const cached = this.cache.get(content_id);
        if (!cached)
            return false;

        const memory = useAireMemory().get(cached.origin);
        if (!memory)
            return false;

        return await memory.postContentRating(content_id, vote)
            .then((result) => {
                if (result.status !== AireStatus.Success) {
                    throw Error(result.status.toString());
                }
                this.ratings.set(content_id, vote);
                return true;
            })
            .catch((err) => {
                console.error("Failed to up/down vote content", err);
                return false;
            })
    }

    public async get(content_id: string): Promise<AireContent | undefined> {
        const cached = this.cache.get(content_id);
        if (cached) {
            // Check if thumbnailUrl is valid and not expired
            if (cached.content.thumbnail_url) {
                const url = new URL(cached.content.thumbnail_url);
                const expiry = url.searchParams.get("se");
                if (expiry) {
                    const expiryDate = new Date(expiry);
                    if (expiryDate.getTime() > Date.now()) {
                        // Cached thumbnailUrl is valid, now check the content URL
                        if (cached.content.type === AireContentType.URL) {
                            return cached.content; // Return cached if it's just a URL type
                        }

                        // Check if the main media URL is valid
                        if (cached.content.url) {
                            const mediaUrl = new URL(cached.content.url);
                            const mediaExpiry = mediaUrl.searchParams.get("se");
                            if (mediaExpiry) {
                                const mediaExpiryDate = new Date(mediaExpiry);
                                if (mediaExpiryDate.getTime() > Date.now()) {
                                    return cached.content; // Cached URL is valid
                                }
                            }
                        }
                    }
                }
            }
        }

        // Fetch fresh content if cached data is invalid or missing
        const mem = useAireMemory();
        const sources = cached ? [mem.get(cached.origin)] : mem.all();

        for (const memory of sources) {
            if (!memory)
                continue;

            const content = await memory.getContentWithId(content_id)
                .then((result) => {
                    if (result.data) {
                        // Update the cache with fresh data
                        this.cache.set(content_id, { origin: memory.id, content: result.data });
                        return result.data;
                    } else {
                        return undefined;
                    }
                })
                .catch(() => { return undefined; });

            if (content)
                return content;
        }

        console.warn("Failed to get content", content_id);
    }

    public async getVote(content_id: string): Promise<number> {
        const vote = this.ratings.get(content_id);
        if (vote)
            return vote;

        const content = this.cache.get(content_id);
        if (!content || !content.origin)
            return 0;

        const memory = useAireMemory().get(content.origin);
        if (!memory)
            return 0;

        return await memory.getContentRating(content_id)
            .then((result) => {
                if (result.data) {
                    return result.data.vote;
                }
                else {
                    throw Error(result.status.toString());
                }
            })
            .catch((err) => {
                console.error("Failed to get content rating", err);
                return 0;
            })
    }

    public async getUrl(content_id: string): Promise<string | undefined> {
        const content = await this.get(content_id);
        return content?.url;
    }

    public async addViewCount(content: AireContent) {
        if (!content?.id)
            return;

        const origin = this.cache.get(content.id)?.origin;
        if (!origin)
            return;

        const memory = useAireMemory().get(origin)
        if (!memory) {
            console.warn("Content origin unavailable");
            return;
        }

        await memory.postContentView(content.id)
            .then((result) => {
                if (result.data) {
                    const cache = useContentCache();
                    let cached = cache.get(content.id!);

                    if (cached)
                        cached.content.views = result.data.views;
                    else
                        cached = { origin: origin, content: result.data };

                    cache.set(content.id!, cached);
                }
            })
    }
}

const context = reactive(new ContentContext());

export default function useContent() {
    return context;
}
