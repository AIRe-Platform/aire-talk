<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->

<script setup lang="ts">
import { defineProps, onMounted, reactive } from 'vue';
import { ChatMessage } from '@/models/chat';
import { l } from '@/locales';
import ChatContent from '@/components/chat/ChatContent.vue';
import ContentModal from '@/components/content/ContentModal.vue';
import { AireContent, AireContentType } from 'aire';
import useContent from '@/context/content';
import { fetchAndRankContents } from '@/helpers/contentUtils';

const props = defineProps<{
    message: ChatMessage
}>();

const state = reactive<{
    modalOpen: boolean,
    openContent?: AireContent,
    rankedContents?: AireContent[]
}>({
    modalOpen: false,
    rankedContents: []
});

const contentCtx = useContent();

const toggleModal = () => {
    state.modalOpen = !state.modalOpen;
};

const showContent = async (content: AireContent) => {
    try {
        state.openContent = content;
        switch (content.type) {
            case AireContentType.Image:
            case AireContentType.Video:
                toggleModal();
                break;
            default:
                {
                    const url = content.id
                        ? await contentCtx.getUrl(content.id)
                        : content.url;

                    if (url) {
                        window.open(url, '_blank');
                    }
                }
        }

        if (content.id) {
            await contentCtx.addViewCount(content.id);
        }
    } catch (error) {
        console.error('Error showing content in ChatBubble:', error);
    }
};

const closeModal = () => {
    state.openContent = undefined;
    toggleModal();
};

onMounted(async () => {
    if (props.message.media) {
        state.rankedContents = await fetchAndRankContents(props.message.media);
    }
});

</script>

<template>
    <div class="chat-content-suggestions">
        <span class="chat-content-suggestions-title">
            {{ $t(l.suggestions_title) }}
        </span>
        <span class="chat-content-suggestions-text">
            {{ message.content }}
        </span>
        <div class="chat-content-items" v-if="props.message.media">
            <ChatContent v-for="content in state.rankedContents" :parent="props.message" :content="content"
                :contentId="content.id || ''" :key="content.id" @show="showContent" />
        </div>
        <ContentModal :active="state.modalOpen" :content="state.openContent" @close="closeModal" />
    </div>
</template>

<style scoped>
.chat-content-suggestions {
    display: flex;
    flex-direction: column;
    line-height: 1.4rem;
    padding: 0.5rem 1rem;
    margin: 1rem 1.5rem;
    border: 2px solid var(--box-stroke);
    border-radius: 1rem;
    align-self: center;
    max-width: 80%;
    background-color: var(--ia-chat-box-background);
}

.chat-content-suggestions-title {
    font-size: var(--font-medium);
    font-weight: bold;
    align-self: center;
    color: var(--title-text);
}

.chat-content-suggestions-text {
    display: flex;
    flex-direction: column;
    font-size: var(--font-medium);
    align-self: center;
}

.chat-content-items {
    display: flex;
    flex-direction: row;
    align-items: center;
    align-self: center;
    max-width: 100%;
    /*  overflow-x: scroll; */
}
</style>