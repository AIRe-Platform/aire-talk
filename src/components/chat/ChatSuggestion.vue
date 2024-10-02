<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->

<script setup lang="ts">
import { l } from '@/locales';
import ContentModal from '../content/ContentModal.vue';

import { onMounted, reactive, defineEmits } from 'vue';
import useSuggestion from '@/context/suggestions';
import Panel from '@/components/common/Panel.vue';
import ChatContent from '@/components/chat/ChatContent.vue';
import { AireContent, AireContentType } from 'aire';
import useContent from '@/context/content';
import { router } from '@/router';
import CloseSuggestionMenuButton from "@/components/chat/CloseSuggestionMenuButton.vue";

const state = reactive<{
    busy: boolean,
    isOpenContent: boolean,
    content: AireContent[],
    selectedContent: AireContent | undefined,
    isSuggestionMenuOpen: boolean
}>({
    busy: false,
    isOpenContent: false,
    content: [],
    selectedContent: undefined,
    isSuggestionMenuOpen: true
});

const suggestion = useSuggestion();
const contentContext = useContent();

const toggleModal = () => {
    state.isOpenContent = !state.isOpenContent;
}

const toggleSuggestionMenuModal = () => {
    state.isSuggestionMenuOpen = !state.isSuggestionMenuOpen;

}

// Now returns an array of media IDs
const getContentIDs = (): string[] => {
    const chatMessage = suggestion.message;
    return chatMessage?.media || [];
};

const showContent = async (content: AireContent) => {
    state.selectedContent = content;
    try {
        switch (content.type) {
            case AireContentType.Image:
            case AireContentType.Video:
                toggleModal();
                break;
            default: {
                let url = content.url;

                if (content.id)
                    url = await contentContext.getUrl(content.id);

                if (url)
                    window.open(url, '_blank');

                break;
            }
        }

        if (content.id) {
            await contentContext.addViewCount(content.id);
        }
    } catch (error) {
        console.error('Error showing content in ChatBubble:', error);
    }
};

const emit = defineEmits<{
    closePanel: [e: any];
}>();

const listContent = async () => {
    try {
        state.content = [];

        // Fetch the content using the media IDs from the suggestions
        const contentIDs = getContentIDs();

        // Iterate over the media items and fetch their content asynchronously
        const fetchContentPromises = contentIDs.map(async (id) => {
            try {
                const item = await contentContext.get(id);
                if (item) {
                    state.content.push(item);
                }
            } catch (error) {
                console.error(`Error fetching content for media ID ${id}:`, error);
            }
        });

        // Wait for all fetch operations to complete
        await Promise.all(fetchContentPromises);

    } catch (error) {
        console.error('Error listing content in ChatBubble:', error);
    }
}
const navigateTo = async (path: string) => {
    router.push(path);
};

onMounted(() => {
    listContent();
});
</script>

<template>
    <ContentModal :active="state.isOpenContent" :content="state.selectedContent" :onClose="toggleModal" />
    <Panel class="suggestion-panel">
        <div class="suggestions-first-row">
            <div class="suggestions-title">
                {{ $t(l.suggestions_title) }}
            </div>
            <CloseSuggestionMenuButton @toggle-menu-open="toggleSuggestionMenuModal"
                :menu-open="state.isSuggestionMenuOpen" @click.stop="emit('closePanel', undefined)" />
        </div>

        <div class="suggestion-title" v-if="suggestion.message">
            <span class="suggestion-suggestions-text">{{ suggestion.message.content }}</span>
        </div>
        <div class="suggestion-suggestions" v-for="(contentItem, index) in state.content" :key="index">
            <ChatContent v-if="contentItem.id" :contentId="contentItem.id" @show="() => showContent(contentItem)" />
        </div>

        <div class="suggestion-buttons" v-if="!state.busy">
            <button class="summary-button" @click="navigateTo('/content-catalogue')">
                <span class="summary-button-text">{{ $t(l.suggestion_check_for_more) }}</span>
                <div class="update-icon">
                </div>
            </button>
        </div>
    </Panel>
</template>

<style lang="scss" scoped>
.suggestions-first-row {
    display: flex;
    justify-content: space-between;
}

.suggestion-panel {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    background-color: var(--panel-background-color);
    width: 12rem;
    padding: 1rem;
    margin: 1rem;
    gap: 1rem;
}

.suggestions-title {
    display: flex;
    justify-content: center;
}

.suggestion-suggestions {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.suggestion-buttons {
    display: flex;
    justify-content: center;
}
</style>