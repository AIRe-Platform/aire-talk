// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.


<script setup lang="ts">
import { ChatMessage } from '@/models/chat';
import { defineProps } from 'vue';
import { AireContent, AireContentType } from 'aire';
import Modal from "@/components/common/Modal.vue";

const props = defineProps<{
    active: boolean,
    parent?: ChatMessage,
    content?: AireContent,
    onClose: () => void
}>()

const openUrl = (url?: string) => {
    if (url)
        window.open(url, '_blank');
};

const download = async (url?: string) => {
    console.log("descargando...", url);
    if (url) {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'video.mp4'; // You can specify the default filename
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href); // Clean up the URL object
        } catch (error) {
            console.error('Failed to download video:', error);
        }
    }

};
</script>

<template>
    <Modal :active="active" @close="props.onClose" :showCloseButton="true">
        <div v-if="props.parent" class="message-header">
            <h1 v-if="props.parent.role != 'user'">{{ $t(props.parent.sender) }}</h1>
            <h1 v-if="props.parent.role == 'user'">{{ (props.parent.sender) }}</h1>
        </div>
        <div v-if="!props.parent" class="message-header-gap"></div>
        <div class="message-container">
            <div class="message-body">
                <p v-if="props.parent && props.parent.content">{{ props.parent.content }}</p>
                <div class="message-media" v-if="props.content">
                    <template v-if="props.content.type == AireContentType.Image">
                        <img v-bind:src="props.content.url" />
                        <p>{{ props.content.name }}</p>
                    </template>
                    <template v-if="props.content.type == AireContentType.Video">
                        <video controls autoplay>
                            <source v-bind:src="props.content.url" type="video/mp4">
                        </video>
                        <p>{{ props.content.name }}</p>
                    </template>
                    <button class="media-url" @click="openUrl(props.content?.url)"
                        v-if="props.content.type == AireContentType.URL">
                        <font-awesome-icon icon="fa-solid fa-link" />
                        <span>
                            <h2>{{ props.content.name }}</h2>
                            <small>
                                <code>{{ props.content.url }}</code>
                            </small>
                        </span>
                    </button>
                    <button class="media-document" @click="openUrl(props.content?.url)"
                        v-if="props.content.type == AireContentType.Document">
                        <font-awesome-icon icon="fa-solid fa-file-invoice" />
                        <span>{{ props.content.name }}</span>
                    </button>
                </div>
            </div>
            <div class="message-options">
                <div class="icon download" @click="download(props.content?.url)">
                </div>
            </div>
        </div>
    </Modal>
</template>

<style scoped>
.message-container {
    display: flex;
}

.message-options {
    display: flex;
    align-items: flex-end;
}

.message-body {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.message-header {
    margin-right: 2rem;
}

.message-header-gap {
    padding-top: 2rem;
}

.message-media {

    img,
    video,
    .content-document {
        width: 100%;
        height: auto;
        max-width: 50rem;
        max-height: 25rem;
    }

    .media-url {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        max-width: 32rem;
        gap: 1rem;

        svg {
            width: 32px;
            height: auto;
        }

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

.ui-mode-mobile {
    .message-media {

        img,
        video,
        .content-document {
            max-width: 20rem;
            max-height: 10rem;
        }
    }
}
</style>