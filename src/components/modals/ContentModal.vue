<script setup lang="ts">
import { defineProps } from 'vue';
import { AireContent, AireContentType } from "aire";
import Modal from "@/components/common/Modal.vue";

const props = defineProps<{
    active: boolean,
    content: AireContent,
    onClose: () => void
}>()

const openUrl = (url: string) => {
    window.open(url, '_blank');
}
</script>

<template>
    <Modal :active="active" @close="props.onClose" :showCloseButton="true">
        <h1 class="content-header">{{ (props.content.name) }}</h1>
        <div class="content-body">
            <div class="content-media" v-if="props.content">
                <template v-if="props.content.type == AireContentType.Image">
                    <img v-bind:src="props.content.url" />
                </template>
                <template v-if="props.content.type == AireContentType.Video">
                    <video controls>
                        <source v-bind:src="props.content.url" type="video/mp4">
                    </video>
                </template>
                <button class="media-url" @click="openUrl(props.content.url)"
                    v-if="props.content.type == AireContentType.URL">
                    <font-awesome-icon icon="fa-solid fa-link" />
                    <span>
                        <h2>{{ props.content.name }}</h2>
                        <small>
                            <code>{{ props.content.url }}</code>
                        </small>
                    </span>
                </button>
                <button class="media-document" @click="openUrl(props.content.url)"
                    v-if="props.content.type == AireContentType.Document">
                    <font-awesome-icon icon="fa-solid fa-file-invoice" />
                    <span>{{ props.content.name }}</span>
                </button>
            </div>
        </div>
    </Modal>
</template>

<style scoped>
.content-body {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.content-header {
    margin-right: 2rem;
}

.content-media {
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
</style>