// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.


import { useChatCache } from "@/context/cache";
import { ChatMessage } from "@/models/chat";
import { AireContent } from "aire";
import useContent from "@/context/content";

export function getChatContentIds(messages: ChatMessage[]): string[] {
    const contentIds = messages
        .flatMap(x => x.media)
        .filter(x => x !== undefined)
        .flatMap(x => x!);

    // Combine all content and thumbnils ids
    const allUnique = [...new Set([...contentIds])];

    return allUnique;
}

export async function getAllSuggestedContentFromHistory(): Promise<{ chatId: string; contentId: string }[]> {
    const content: { chatId: string; contentId: string }[] = [];

    const cache = useChatCache();
    for (const id in cache) {
        const chat = cache.get(id);
        if (!chat)
            continue;

        getChatContentIds(chat.messages).forEach(contentId => {
            content.push({
                chatId: id,
                contentId: contentId
            });
        })
    }

    return [...content];
}

async function calculateRating(content: AireContent): Promise<number> {
    const viewsWeight = 0.7; // Adjust the weight for views
    const thumbsUpWeight = 0.3; // Adjust the weight for thumbs up

    const viewsScore = content.views || 0;
    const thumbsUpScore = content.thumbs_up || 0;

    // You could apply a logarithmic or linear scaling based on views or thumbs up
    const rating = (viewsScore * viewsWeight) + (thumbsUpScore * thumbsUpWeight);

    return rating;
}

export async function rankSelectedContent(selectedContents: AireContent[]): Promise<AireContent[]> {
    // First, calculate the rating for each selected content item
    const ratedContents = await Promise.all(selectedContents.map(async content => ({
        ...content,
        score: await calculateRating(content)
    })));

    // Sort the contents based on their ratings synchronously
    ratedContents.sort((a, b) => (b.score || 0) - (a.score || 0));

    // Normalize the ratings by assigning a rank
    return ratedContents;
}

// Function to fetch content and rank it
export async function fetchAndRankContents(contents: string[]): Promise<AireContent[]> {
    const results: AireContent[] = [];
    for (const content_id of contents) {
        const fetchedContent = await useContent().get(content_id);
        if (fetchedContent)
            results.push(fetchedContent);
    }

    if (results.length > 0)
        return await rankSelectedContent(results);

    return [];
}
