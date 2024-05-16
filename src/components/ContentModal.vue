<script setup lang="ts">
import { defineProps } from 'vue';
import { Content, type ContentType } from "aire";

const props = defineProps<{
    active: boolean,
    content: Content,
    onClose: () => void
}>()

const close = (e: Event) => {
    e.stopPropagation()
    props.onClose()
}
</script>

<template>
    <transition name="modal-animation">
        <div v-show="active" class="modal">
            <transition name="modal-animation-inner">
                <div class="modal-inner">
                    <div class="modal-component">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h1>{{ (props.content.name) }}
                                </h1>
                                <div class="icon close-window modal-close" @click="close">
                                </div>
                            </div>
                            <div class="modal-body">
                                <div class="modal-body-container" v-if="props.content.type == ContentType.Image">
                                    <img v-bind:src="props.content.url" class="modal-body-image">
                                </div>
                                <div class="modal-body-container" v-if="props.content.type == ContentType.Video">
                                    <video class="modal-body-video" controls>
                                        <source v-bind:src="props.content.url" type="video/mp4">
                                    </video>
                                </div>
                                <div class="modal-body-container" v-if="props.content.type == ContentType.URL">
                                    <a v-bind:href=props.content.url target="_blank">{{ props.content.url }}</a>
                                </div>
                                <div class="modal-body-container" v-if="props.content.type == ContentType.Document">
                                    <div class="icon catalogue-content-mobile" :src="props.content.url" alt="">
                                    </div>
                                    <div>{{ props.content.name }}</div>
                                </div>
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
    height: 100%;
    width: 100%;
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
        max-width: 100%;
        max-height: 100%;
    }


}
</style>