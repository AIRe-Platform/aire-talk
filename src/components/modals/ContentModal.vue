<script setup lang="ts">
import { defineProps } from 'vue';
import { AireContent, AireContentType } from "aire";
import Modal from "@/components/common/Modal.vue";

const props = defineProps<{
    active: boolean,
    content: AireContent,
    onClose: () => void
}>()
</script>

<template>
    <Modal :active="active" @close="props.onClose" :showCloseButton="true">
        <div class="modal-component">
            <div class="modal-content">
                <div class="modal-header">
                    <h1>{{ (props.content.name) }}</h1>
                </div>
                <div class="modal-body">
                    <div class="modal-body-container" v-if="props.content.type == AireContentType.Image">
                        <img v-bind:src="props.content.url" class="modal-body-image">
                    </div>
                    <div class="modal-body-container" v-if="props.content.type == AireContentType.Video">
                        <video class="modal-body-video" controls>
                            <source v-bind:src="props.content.url" type="video/mp4">
                        </video>
                    </div>
                    <div class="modal-body-container" v-if="props.content.type == AireContentType.URL">
                        <a v-bind:href=props.content.url target="_blank">{{ props.content.url }}</a>
                    </div>
                    <div class="modal-body-container" v-if="props.content.type == AireContentType.Document">
                        <div class="icon catalogue-content-mobile" :src="props.content.url" alt="">
                        </div>
                        <div>{{ props.content.name }}</div>
                    </div>
                </div>
            </div>
        </div>
    </Modal>
</template>

<style lang="scss" scoped>
.modal-component {
    display: flex;
    justify-content: space-between;
    flex-direction: row-reverse;
}

.modal-body-image {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100%;
}

.modal-button {
    cursor: pointer;
    width: 2rem;
    display: flex;
    justify-content: center;
}

.modal-body-container {
    display: flex;
    flex-direction: column;
}

.modal-body-video {
    width: 100%;
    height: 100%;
}

.modal-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

.modal-body {
    display: flex;
    justify-content: center;
}

.catalogue-content-mobile {
    width: 15rem;
    height: 15rem;
}

/* mobile*/
.ui-mode-mobile {
    .modal-body-video-container {
        margin-top: 1rem;
    }

    .modal-body-video {
        max-width: 100%;
        max-height: 100%;
    }
}
</style>