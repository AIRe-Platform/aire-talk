<script setup lang="ts">
import { ChatMessage } from '@/models/chat';
import { defineProps } from 'vue';
import { AireContent, AireContentType } from 'aire';
import Modal from "@/components/common/Modal.vue";

const props = defineProps<{
    active: boolean,
    parent: ChatMessage,
    content?: AireContent,
    onClose: () => void
}>()

const openUrl = (url: string) => {
    window.open(url, '_blank');
};
</script>

<template>
    <Modal :active="active" @close="props.onClose" :showCloseButton="true">
        <div class="message-header">
            <h1 v-if="props.parent.role == 'user'">{{ (props.parent.sender) }}</h1>
        </div>
        <div class="message-body">
            <p v-if="props.parent.content">{{ props.parent.content }}</p>
            <div class="message-media" v-if="props.content">
                <img v-bind:src="props.content.url" v-if="props.content.type == AireContentType.Image">
                <video controls v-if="props.content.type == AireContentType.Video">
                    <source v-bind:src="props.content.url" type="video/mp4">
                </video>
                <button class="media-url" @click="openUrl(props.content.url)" v-if="props.content.type == AireContentType.URL">
                    <font-awesome-icon icon="fa-solid fa-link" />
                    <span>{{ props.content.url }}</span>
                </button>
                <button class="media-document" @click="openUrl(props.content.url)" v-if="props.content.type == AireContentType.Document">
                    <font-awesome-icon icon="fa-solid fa-file-invoice" />
                    <span>{{ props.content.name }}</span>
                </button>
            </div>
            <p v-if="props.content"> {{ props.content.name }}</p>
        </div>
    </Modal>
</template>

<style scoped>
.message-body {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.message-header {
    margin-right: 2rem;
}

.message-media {
    img,
    video,
    .content-document {
        width: 100%;
        height: auto;
    }

    .media-url {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        max-width: 32rem;
        gap: 1rem;

        span {
            text-overflow: ellipsis;
            overflow: hidden
        }
    }

    .media-document {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        max-width: 32rem;
        gap: 1rem;

        svg {
            width: 64px;
            height: auto;
        }

        span {
            width: 100%;
            text-overflow: ellipsis;
            overflow: hidden
        }
    }
}
</style>