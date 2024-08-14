<script setup lang="ts">
import useContent from '@/context/content';
import { ChatMessage } from '@/models/chat';
import { AireContent } from 'aire';
import { defineProps, defineEmits, reactive, onMounted } from 'vue';
import CatalogueItem from "@/components/content/CatalogueItem.vue";

import ChatBubbleOptions from './ChatBubbleOptions.vue';

const props = defineProps<{
    parent: ChatMessage,
    contentId: string;
}>();

const emits = defineEmits<{
    show: [AireContent]
}>();

const state = reactive<{
    content?: AireContent
}>({});

onMounted(async () => {
    state.content = await useContent().get(props.contentId);
})
</script>

<template>
    <div class="chat-content" v-if="state.content" @click.stop="emits('show', state.content!)">
        <ChatBubbleOptions :parent="props.parent" :can_revert="false" :content="state.content" />
        <CatalogueItem :content="state.content" @show="state.content" />
    </div>
</template>

<style scoped lang="scss">
.chat-content {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    background-color: var(--panel-background-color);
    border-radius: 1rem;
}

.chat-content-title {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: center;
    justify-content: flex-start;
    margin: 0 1rem;
}

.chat-content-media {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 0 1rem;

    border: 1px solid var(--box-stroke);
    border-radius: 1rem;
    overflow: hidden;
}

.chat-content-link,
.chat-content-document {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    height: 4rem;
    color: var(--box-stroke);
    margin: 1rem;

    &>* {
        height: 100%;
    }
}

.chat-content-description {
    display: flex;
    margin: 0 1rem;
    justify-content: flex-start;
}

.icon-link {
    width: 5rem;
    height: 6rem;
    color: var(--link-icon);
}

@media screen and ((max-aspect-ratio: 1/1) or (max-width: 920px)) {
    .chat-content {
        max-width: unset;
        min-width: unset;
    }
}
</style>