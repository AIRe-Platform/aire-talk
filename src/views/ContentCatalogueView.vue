<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->


<script setup lang="ts">
import { l } from "@/locales";
import { router } from "@/router";
import { computed, onMounted, reactive } from "vue";
import { AireContent, AireKeyword } from "aire";
import { getAllSuggestedContentFromHistory, rankSelectedContent } from "@/helpers/contentUtils";
import Tooltip from "@/components/common/Tooltip.vue";
import useContent from "@/context/content";
import Spinner from "@/components/common/Spinner.vue";
import CatalogueItem from "@/components/content/CatalogueItem.vue";
import ContentModal from "@/components/content/ContentModal.vue";
import { getAllKeywordsFromHistory } from "@/helpers/keywordUtils";
import KeywordFilter from "@/components/KeywordFilter.vue";
import useMobileLayout from "@/helpers/mobile";
import Panel from "@/components/common/Panel.vue";

const navigateTo = (path: string) => {
    router.push(path);
}

// Define a type that wraps AireContent with chatId
export interface AireContentWithChatId extends AireContent {
    chatId: string; // or the appropriate type for chatId, such as string
}
const contentContext = useContent();

export type SortOption = 'newest' | 'oldest';

const state = reactive<{
    busy: boolean,
    deleteId?: string,
    openContent?: AireContent,
    confirmDelete: boolean,
    selectedItem?: AireContent,
    contentList: AireContentWithChatId[],
    rankedContents: AireContent[],
    modalOpen: boolean,
    keywords: AireKeyword[],
    selectedKeywords: AireKeyword[],
    timeSortOption: SortOption,
    searchQuery: string,
    showFilters: boolean
}>({
    busy: false,
    confirmDelete: false,
    modalOpen: false,
    contentList: [],
    rankedContents: [],
    keywords: [],
    selectedKeywords: [],
    timeSortOption: 'newest',
    searchQuery: '',
    showFilters: false,
});

const filteredContents = computed(() => {
    let result = state.contentList.map(item => {
        // eslint-disable-next-line no-unused-vars
        const { chatId, ...content } = item; // Extract content, leaving out chatId
        return content; // Return only the content part (AireContent)
    });
    // Filter based on selected keywords
    if (state.selectedKeywords && state.selectedKeywords.length > 0) {
        const selectedValues = state.selectedKeywords.map(k => k.value);
        result = result.filter(content =>
            content.keywords && content.keywords.some(keyword => selectedValues.includes(keyword))
        );
    }

    // Filter by search query in name, description and copyright from content

    if (state.searchQuery.trim() !== '') {
        const query = state.searchQuery.trim().toLowerCase();
        result = result.filter(content =>
            content.name?.toLowerCase().includes(query) ||
            content.description?.toLowerCase().includes(query) ||
            content.copyright?.toLowerCase().includes(query)
        );
    }
    // Apply sorting by modified date
    return sortContents(result);
});

// Handler function to update selected keywords
const updateSelectedKeywords = (newSelected: AireKeyword[]) => {
    state.selectedKeywords = newSelected;
};

const clearFilter = () => {
    state.selectedKeywords = [];
    state.searchQuery = '';
};

const toggleModal = () => {
    state.modalOpen = !state.modalOpen;
};

const toggleFilters = () => {
    state.showFilters = !state.showFilters;
    if (!state.showFilters)
        clearFilter();
};

const closeModal = () => {
    state.openContent = undefined;
    toggleModal();
};

const sortContents = (contents: AireContent[]) => {
    if (state.timeSortOption === 'newest') {
        return [...contents].sort((a, b) => {
            const dateA = a.modified ? new Date(a.modified).getTime() : 0;
            const dateB = b.modified ? new Date(b.modified).getTime() : 0;
            return dateB - dateA;
        });
    } else if (state.timeSortOption === 'oldest') {
        return [...contents].sort((a, b) => {
            const dateA = a.modified ? new Date(a.modified).getTime() : 0;
            const dateB = b.modified ? new Date(b.modified).getTime() : 0;
            return dateA - dateB;
        });
    }
    return contents; // If 'none', return unsorted
};

const updateSearchQuery = (event: Event) => {
    const target = event.target as HTMLInputElement;
    state.searchQuery = target.value;
};

const listContent = async () => {
    const ids = await getAllSuggestedContentFromHistory();
    const uniqueContentMap = new Map<string, any>();

    for (const { chatId, contentId } of ids) {
        const item = await contentContext.get(contentId);

        if (item) {
            // item.chatId = chatId;
            const wrappedItem: AireContentWithChatId = { ...item, chatId };
            if (uniqueContentMap.has(contentId)) {
                const existingItem = uniqueContentMap.get(contentId);

                // Compare modified timestamps, if both are defined, and keep the latest one
                if (
                    wrappedItem.modified && existingItem.modified &&
                    wrappedItem.modified > existingItem.modified
                ) {
                    uniqueContentMap.set(contentId, wrappedItem);
                } else if (!existingItem.modified || (wrappedItem.modified && !existingItem.modified)) {
                    // If existingItem.modified is undefined, prefer wrappedItem
                    uniqueContentMap.set(contentId, wrappedItem);
                }
            } else {
                //no dupes
                uniqueContentMap.set(contentId, wrappedItem);
            }
        }
    }

    state.contentList = Array.from(uniqueContentMap.values());
};

const showContent = async (content: AireContent) => {

    try {
        state.openContent = content;
        toggleModal();
        if (content.id) {
            await contentContext.addViewCount(content.id);
        }
    } catch (error) {
        console.error('Error addViewCount in content in content catalogue view:', error);
    }
};

const showFilter = () => {
    state.showFilters = false;
};

const beforeEnter = (el: Element) => {
    const element = el as HTMLElement;
    element.style.height = '0';
    element.style.opacity = '0';
};

const enter = (el: Element) => {
    const element = el as HTMLElement;
    element.style.transition = 'height 0.3s ease, opacity 0.3s ease';
    element.style.height = `${element.scrollHeight}px`;
    element.style.opacity = '1';
};

const leave = (el: Element) => {
    const element = el as HTMLElement;
    element.style.transition = 'height 0.3s ease, opacity 0.3s ease';
    element.style.height = '0';
    element.style.opacity = '0';
};

onMounted(async () => {

    state.busy = true;
    await listContent();
    state.keywords = await getAllKeywordsFromHistory();

    state.busy = false;
    // Rank the content only if it's not empty
    if (state.contentList && state.contentList.length > 0) {
        // Extract only the content part (AireContent) from the wrapped items
        const contentWithoutChatId = state.contentList.map(item => {
            // eslint-disable-next-line no-unused-vars
            const { chatId, ...content } = item; // Extract content without chatId
            return content; // Return only the content part
        });

        // Pass the extracted content to the ranking function
        state.rankedContents = await rankSelectedContent(contentWithoutChatId);
    }
});

</script>

<template>
    <ContentModal :active="state.openContent !== undefined && state.modalOpen" v-if="state.openContent"
        :content="state.openContent"
        :chatId="state.contentList?.find(content => content.id === state.openContent?.id)?.chatId"
        :onClose="closeModal" />
    <div class="content-catalogue-view">
        <Tooltip :text="$t(l.tooltip_close)" position="top" :useMaxContent="true" :adjustPosition="true"
            class="xmark-icon">
            <a class="tooltip-inside circle-icon" @click="navigateTo('/chat')" @keydown.space="navigateTo('/chat')"
                :aria-label="$t(l.tooltip_close)" href="#">
                <font-awesome-icon icon="fa-solid fa-xmark" />
            </a>
        </Tooltip>
        <div class="content-catalogue-header">
            <div class="content-catalogue-header-text">
                <h1>{{ $t(l.nav_catalogue) }}</h1>
            </div>
        </div>
        <Spinner v-if="state.busy" />
        <div class="content-catalogue-filter-row" v-if="!state.busy">
            <div class="filter-header">
                <div class="filter-header-left">
                    <button class="btn filter-button" @click="toggleFilters">
                        {{ $t(l.content_catalogue_filters) }}
                        <font-awesome-icon
                            :icon="state.showFilters ? 'fa-solid fa-sort-up' : 'fa-solid fa-sort-down'" />
                    </button>
                    <div class="clear-filter" v-if="state.showFilters" @click="clearFilter">
                        {{ $t(l.content_catalogue_clear_filter) }}
                    </div>
                </div>
                <button class="btn" v-if="useMobileLayout && state.showFilters" v-on:click="showFilter()">
                    {{ $t(l.content_catalogue_apply_filter) }}
                </button>
            </div>
            <Transition name="content-catalogue-filter" @before-enter="beforeEnter" @enter="enter" @leave="leave">
                <Panel class="content-catalogue-filter-filters" v-if="state.showFilters">
                    <div class="filter-by-query">
                        <label class="label" for="search">{{ $t(l.content_catalogue_search_by) }}</label>
                        <input v-model="state.searchQuery" id="search" type="text"
                            :placeholder="$t(l.content_catalogue_query_placeholder)" @input="updateSearchQuery" />
                    </div>
                    <div class="filter-by-time">
                        <label class="label" for="sortDropdown">{{ $t(l.content_catalogue_sort_by) }}</label>
                        <select id="sortDropdown" v-model="state.timeSortOption">
                            <option value="newest">{{ $t(l.content_catalogue_newest_filter) }}</option>
                            <option value="oldest">{{ $t(l.content_catalogue_oldest_filter) }}</option>
                        </select>
                    </div>
                    <div class="filter-by-keywords">
                        <h2 class="label">{{ $t(l.content_modal_themes) }}</h2>
                        <KeywordFilter :keywords="state.keywords" :selectedKeywords="state.selectedKeywords"
                            @update:selectedKeywords="updateSelectedKeywords" />
                    </div>
                </Panel>
            </Transition>
        </div>
        <div class="content-catalogue-content" v-if="!state.busy">
            <div v-if="state.rankedContents.length == 0">
                <h2 class="empty-catalogue">{{ $t(l.content_catalogue_empty) }}</h2>
            </div>
            <div class="content-catalogue-list">
                <CatalogueItem v-for="item in filteredContents" v-bind:key="item.id" :content="item" @show="showContent"
                    :isFromSummary="false" />
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
#search {
    padding: 0.5em;
    border: 1px solid #ddd;
    border-radius: 4px;
    width: 100%;
    max-width: 300px;
}


.filter-by-time {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.filter-by-keywords {
    display: flex;
    align-items: center;
}

.content-catalogue-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-grow: 1;
    padding: 0rem;
    background-color: var(--panel-background-color);
    border-radius: 1rem;
    border-color: var(--panel-border-color);
    position: relative;
    overflow: hidden;
}

.content-catalogue-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
}

.xmark-icon {
    position: absolute;
    right: 1rem;
    top: 1rem;
}

.tooltip-inside {
    height: 2rem;
    width: 2rem;
}

.content-catalogue-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 2rem;
    border-bottom: 2px solid var(--accent-primary-color);
    width: 85%;
    padding-top: 2rem;
}

.label {
    width: 5rem;
}

.content-catalogue-filter-button {
    padding: 1rem;
    width: 8rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

.section-separator {
    width: 85%;
    align-self: center;
}

.content-catalogue-section {
    display: flex;
    flex-direction: column;
    align-self: stretch;
    background-color: var(--panel-background-color);
    overflow: hidden;

    &>* {
        margin: 2rem 3rem;
    }
}

.content-catalogue-list {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: center;
    padding: 1rem;
    overflow: auto;
}

.btn.selected {
    background-color: var(--accent-primary-color);
    border-color: transparent;
    color: var(--background-color);
    box-shadow: 0 0 5px var(--accent-primary-color);
}

.btn {
    padding: 8px 12px;
    margin: 4px;
    cursor: pointer;
    border: none;
    border-radius: 4px;
}

.filter-header {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: center;
    justify-content: flex-start;
    width: -webkit-fill-available;
    justify-content: space-between;
}

.filter-header-left {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.filter-by-query {
    gap: 1rem;
    display: flex;
    align-items: center;
}

.filter-button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
}

.clear-filter {
    cursor: pointer;
    text-decoration: underline;
}

.content-catalogue-filter-row {
    display: flex;
    flex-direction: column;
    width: 80%;
    padding: 1rem;
    align-items: flex-start; // Align filters and button to the start for consistency
    position: relative;
}

.content-catalogue-filter-filters {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    padding: 1rem;
    background-color: var(--panel-menu-background-color);
}

.content-catalogue-filter-enter-active,
.content-catalogue-filter-leave-active {
    transition: height 0.5s ease, opacity 0.5s ease;
}

.content-catalogue-filter-enter,
.content-catalogue-filter-leave-to {
    height: 0;
    opacity: 0;
}

@media screen and ((max-aspect-ratio: 1/1) or (max-width: 920px)) {
    .content-catalogue-view {
        padding: 2rem 0rem;
        width: 95%;
    }
}

@media screen and (max-width: 715px) {
    .filter-header {
        padding: 1rem 0rem;
    }

    .empty-catalogue {
        padding: 1rem;
        text-align: center;
    }

    .content-catalogue-filter {
        display: block;
    }

    .content-catalogue-filter-filters {
        padding: 1rem;
        width: 90%;
    }

    .content-catalogue-filter-row {
        width: 90%;
    }

    .filter-by-keywords {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        /* overflow: scroll; */
        height: 20rem;
    }
}
</style>
