// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.


import { AireServices, AireStatus, AireContent, AireContentType } from "aire";
import { reactive } from "vue";
import { useContentCache } from "./cache";

export class ContentContext {
    private ratings: Map<string, number>;

    constructor() {
        this.ratings = new Map<string, number>();
    }

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
        if (!AireServices.Memory) {
            console.warn("Memory service is unavailable");
            return [];
        }

        return await AireServices.Memory.searchContent(keywords)
            .then((result) => {
                if (!result.data) {
                    throw Error(result.status.toString())
                }

                const cache = useContentCache();
                result.data.forEach(x => cache.set(x.id!, x));

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
    }

    /**
     * Up or down vote the content
     * @param content_id Content identifier
     * @param vote > 0 for an upvote, < 0 for a downvote, 0 to undo vote
     */
    public async vote(content_id: string, vote: number): Promise<boolean> {
        if (!AireServices.Memory) {
            console.warn("Memory service is unavailable");
            return false;
        }

        return await AireServices.Memory.postContentRating(content_id, vote)
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
        const cache = useContentCache();
        if (!AireServices.Memory) {
            console.warn("Memory service is not available");
            return;
        }
    
        const cached = cache.get(content_id);
        if (cached) {
            // Check if thumbnailUrl is valid and not expired
            if (cached.thumbnailUrl) {
                const url = new URL(cached.thumbnailUrl);
                const expiry = url.searchParams.get("se");
                if (expiry) {
                    const expiryDate = new Date(expiry);
                    if (expiryDate.getTime() > Date.now()) {
                        // Cached thumbnailUrl is valid, now check the content URL
                        if (cached.type === AireContentType.URL) {
                            return cached; // Return cached if it's just a URL type
                        }
    
                        // Check if the main media URL is valid
                        if (cached.url) {
                            const mediaUrl = new URL(cached.url);
                            const mediaExpiry = mediaUrl.searchParams.get("se");
                            if (mediaExpiry) {
                                const mediaExpiryDate = new Date(mediaExpiry);
                                if (mediaExpiryDate.getTime() > Date.now()) {
                                    return cached; // Cached URL is valid
                                }
                            }
                        }
                    }
                }
            }
        }
    
        // Fetch fresh content if cached data is invalid or missing
        return await AireServices.Memory.getContentWithId(content_id)
            .then((result) => {
                if (result.data) {
                    // Update the cache with fresh data
                    cache.set(content_id, result.data);
                    return result.data;
                } else {
                    throw Error(result.status.toString());
                }
            })
            .catch((err) => {
                console.error("Failed to get content", err);
                return undefined;
            });
    }
    

    public async getVote(content_id: string): Promise<number> {
        const vote = this.ratings.get(content_id);
        if (vote)
            return vote;

        if (!AireServices.Memory) {
            console.warn("Memory service is not available");
            return 0;
        }

        return await AireServices.Memory.getContentRating(content_id)
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

    public async addViewCount(content_id: string) {
        if (!AireServices.Memory) {
            console.warn("Memory service is not available");
            return;
        }

        await AireServices.Memory.postContentView(content_id)
            .then((result) => {
                if (result.data) {
                    const cache = useContentCache();
                    let content = cache.get(content_id);

                    if (content)
                        content.views = result.data.views;
                    else
                        content = result.data;

                    cache.set(content_id, content);
                }
            })
    }
}

const context = reactive(new ContentContext());

export default function useContent() {
    return context;
}
