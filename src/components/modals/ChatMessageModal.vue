<script setup lang="ts">
import { ChatMessage } from '@/models/chat';
import { defineProps } from 'vue';
import { AireContent, AireContentType } from 'aire';
import Modal from "@/components/common/Modal.vue";

const props = defineProps<{
    active: boolean,
    parent: ChatMessage,
    selectedContent?: AireContent,
    onClose: () => void
}>()

const openContentInNewTab = (url?: string) => {
    if (!url)
        return;

    window.open(url, '_blank');
};
</script>

<template>
    <Modal :active="active" @close="props.onClose" :showCloseButton="true">
        <div class="modal-component">
            <div class="modal-header">
                <h1 v-if="props.parent.role == 'user'">{{ (props.parent.sender) }}</h1>
            </div>
            <div class="modal-body">
                <p v-if="props.parent.content">{{ props.parent.content }}</p>
                <div class="modal-body-image"
                    v-if="props.selectedContent && props.selectedContent.type == AireContentType.Image">
                    <img v-bind:src="props.selectedContent.url" class="chat-message-image-contain">
                </div>
                <div class="modal-body-video-container"
                    v-if="props.selectedContent && props.selectedContent.type == AireContentType.Video">
                    <video class="modal-body-video" autoplay controls>
                        <source v-bind:src="props.selectedContent.url" type="video/mp4">
                    </video>
                </div>
                <div class="modal-body-document-container"
                    v-if="props.selectedContent && props.selectedContent.type == AireContentType.Document">
                    <div class="icon document" v-if="props.selectedContent.url !== undefined"
                        @click="openContentInNewTab(props.selectedContent?.url)"></div>
                </div>
                <div class="modal-body-document-container"
                    v-if="props.selectedContent && props.selectedContent.type == AireContentType.URL">
                    <font-awesome-icon icon="fa-solid fa-link" class="icon-link"
                        @click="openContentInNewTab(props.selectedContent?.url)" v-if="props.selectedContent.url" />
                </div>
                <p v-if="props.selectedContent"> {{ props.selectedContent.name }}</p>
            </div>
        </div>
    </Modal>
</template>

<style lang="scss" scoped>
$primary-color: var(--panel-background-color);
$secundary-color: var(--background-color);

.modal-component {
    display: flex;
    justify-content: space-between;
    flex-direction: row-reverse;
}

.modal-body {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.modal-body-image {
    display: flex;
    justify-content: center;
}

.modal-button {
    cursor: pointer;
    width: 2rem;
    display: flex;
    justify-content: center;
}

.modal-body-video {
    width: 100%;
    /* height: 18rem; */
    padding: 1rem;
}

.modal-body-document-container {
    background-color: var(--chat-document-back-ground);
    width: 17rem;
    height: 10rem;
    border-radius: 1rem;
    border-width: 1rem;
    display: flex;
    flex-direction: column;
    align-content: center;
    align-items: center;
    justify-content: center;
    margin-top: 2rem;
    border: 2px solid var(--box-stroke);
}

.modal-logo {
    width: 100%;
    margin-top: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
        display: block;
        object-fit: contain;
        width: 8rem;
    }
}

.chat-message-image-contain {
    max-width: 30rem;
}

.modal-body-url-container {
    display: flex;
    align-items: center;
}

.margin-left {
    margin-left: 1rem;
}

.modal-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.mobile-screen {
    max-width: 28%;
}

.icon-link {
    width: 5rem;
    height: 6rem;
    color: var(--link-icon);
}

.modal-body-video-container {
    margin-top: 1rem;
}

.modal-body-video {
    max-width: 18.5rem;
    max-height: 15rem;
}
</style>