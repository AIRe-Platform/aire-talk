<script setup lang="ts">
import useContent from '@/context/content';
import { ChatMessage } from '@/models/chat';
import { AireContent, AireContentType } from 'aire';
import { defineProps, defineEmits, reactive, onMounted } from 'vue';

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
        <div class="chat-content-title">
            <div class="icon content-image" v-if="state.content.type == AireContentType.Image">
            </div>
            <div class="icon content-video" v-if="state.content.type == AireContentType.Video">
            </div>
            <div class="icon content-url" v-if="state.content.type == AireContentType.URL">
            </div>
            <div class="icon content-document" v-if="state.content.type == AireContentType.Document">
            </div>
            <p v-if="state">{{ new Date(state.content.modified).toLocaleString($i18n.locale) }}</p>
        </div>
        <div class="chat-content-media">
            <img v-if="state.content.type == AireContentType.Image" v-bind:src="state.content.url"
                class="chat-content-image">
            <video v-if="state.content.type == AireContentType.Video" class="chat-content-video">
                <source v-bind:src="state.content.url" type="video/mp4">
            </video>
            <div v-if="state.content.type == AireContentType.URL" class="chat-content-link">
                <font-awesome-icon icon="fa-solid fa-link"/>
            </div>
            <div v-if="state.content.type == AireContentType.Document" class="chat-content-document">
                <font-awesome-icon icon="fa-solid fa-file-invoice"/>
            </div>
        </div>
        <div class="chat-content-description">
            <p>{{ state.content.name }}</p>
        </div>
    </div>
</template>

<style scoped lang="scss">
.chat-content {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    background-color: var(--panel-background-color);
    border-radius: 1rem;
    flex-basis: 1;
    width: 100%;
    max-width: 40%;
    min-width: 16rem;
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

.ui-mode-mobile {
    .chat-content {
        width: 100%;
        max-width: unset;
        min-width: unset;
    }
}
</style>