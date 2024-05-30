<script setup lang="ts">
import { ChatMessage } from '@/models/chat';
import { defineProps } from 'vue';
import { UISettings } from "@/context/ui";
import { Content, ContentType } from 'aire';

const props = defineProps<{
    active: boolean,
    parent: ChatMessage,
    selectedContent?: Content,
    onClose: () => void
}>()

const close = (e: Event) => {
    e.stopPropagation()
    props.onClose()
}

const openContentInNewTab = (url: string) => {
    window.open(url, '_blank');
};
</script>

<template>
    <transition name="modal-animation">
        <div v-show="active" class="modal" :class="{ 'fake-small-screen': UISettings.screenSize == 'mobile-screen' }">
            <transition name="modal-animation-inner">
                <div class="modal-inner">
                    <div class="modal-component">
                        <div class="icon close-window modal-close" @click="close">
                        </div>
                        <div class="modal-content">
                            <div class="modal-header">
                                <h1 v-if="props.parent.role == 'user'">{{ (props.parent.sender) }}
                                </h1>
                                <div class="modal-logo" v-if="props.parent.role != 'user'">
                                    <img src="@/assets/images/aire-logo-letter.svg" alt="Logo" />
                                </div>
                            </div>
                            <div class="modal-body">
                                <p v-if="props.parent.message">
                                    {{ props.parent.role === 'system' ? $t(props.parent.message) : props.parent.message
                                    }}
                                </p>
                                <div class="modal-body-image"
                                    v-if="props.selectedContent && props.selectedContent.type == ContentType.Image">
                                    <img v-bind:src="props.selectedContent.url" class="chat-message-image-contain">
                                </div>
                                <div class="modal-body-video-container"
                                    v-if="props.selectedContent && props.selectedContent.type == ContentType.Video">
                                    <video class="modal-body-video" autoplay controls>
                                        <source v-bind:src="props.selectedContent.url" type="video/mp4">
                                    </video>
                                </div>
                                <div class="modal-body-document-container"
                                    v-if="props.selectedContent && props.selectedContent.type == ContentType.Document">
                                    <div class="icon document" v-if="props.selectedContent.url"
                                        @click="openContentInNewTab(props.selectedContent.url)"></div>
                                </div>
                                <div class="modal-body-document-container"
                                    v-if="props.selectedContent && props.selectedContent.type == ContentType.URL">
                                    <font-awesome-icon icon="fa-solid fa-link" class="icon-link"
                                        @click="openContentInNewTab(props.selectedContent.url)"
                                        v-if="props.selectedContent.url" />
                                </div>
                                <p v-if="props.selectedContent"> {{ props.selectedContent.name }}</p>

                            </div>
                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </transition>
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

.modal-animation-enter-active,
.modal-animation-leave-active {
    transition: opacity 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}

.modal-animation-enter-from,
.modal-animation-leave-to {
    opacity: 0;
}

.modal-animation-inner-enter-active {
    transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02) 0.15s;
}

.modal-animation-inner-leave-active {
    transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}

.modal-animation-inner-enter-from {
    opacity: 0;
    transform: scale(0.8);
}

.modal-animation-inner-leave-to {
    transform: scale(0.8);
}

.modal {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 97vh;
    width: 100vw;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 9000;

    .modal-inner {
        position: relative;
        max-width: 640px;
        width: 80%;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        background-color: #fff;

        padding: 1rem;
        border-radius: 1rem;
        background-color: var(--panel-menu-background-color);
        border: solid 1px var(--panel-border-color);

        i {
            position: absolute;
            top: 15px;
            right: 15px;
            font-size: var(--font-large);
            cursor: pointer;

            &:hover {
                color: crimson;
            }
        }

        button {
            padding: 20px 30px;
            border: none;
            font-size: var(--font-medium);
            background-color: crimson;
            color: #fff;
            cursor: pointer;
        }
    }
}

.fake-small-screen {
    height: 100%;
    width: 18vw;
    position: absolute;
    top: 0;
    left: 0;
}

.icon-link {
    width: 5rem;
    height: 6rem;
    color: var(--link-icon);
}

/* mobile*/
@media screen and ((max-aspect-ratio: 1/1) or (max-width: 660px)) {
    .modal {

        .modal-inner {
            font-size: x-small;
            padding: 1rem;
        }
    }

    .modal-body-video-container {
        margin-top: 1rem;
    }

    .modal-body-video {
        max-width: 18.5rem;
        max-height: 15rem;
    }


}
</style>