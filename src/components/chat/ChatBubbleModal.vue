<script setup lang="ts">
import { ChatMessage } from '@/models/chat';
import { defineProps } from 'vue';
import { UISettings } from "@/context/ui";

const props = defineProps<{
    active: boolean,
    parent: ChatMessage,
    onClose: () => void
}>()

const close = (e: Event) => {
    e.stopPropagation()
    props.onClose()
}
</script>

<template>
    <transition name="modal-animation">
        <div v-show="active" class="modal" :class="{ 'small-screen': UISettings.screenSize == 'mobile-screen' }">
            <transition name="modal-animation-inner">
                <div class="modal-inner">
                    <div class="modal-component">
                        <div class="icon close-window modal-close" @click="close">
                        </div>
                        <div class="modal-content">
                            <div class="modal-header">
                                <h1 v-if="props.parent.role == 'user'">{{ $t(props.parent.sender) }}
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
                                <div class="modal-body-image" v-if="props.parent.image">
                                    <img v-bind:src="props.parent.image" class="chat-message-image-contain">
                                </div>
                                <div class="modal-body-video-container" v-if="props.parent.video">
                                    <video class="modal-body-video" controls>
                                        <source v-bind:src="props.parent.video" type="video/mp4">
                                    </video>
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
}

.modal-button {
    cursor: pointer;
    width: 2rem;
    display: flex;
    justify-content: center;
}

.modal-body-video {
    width: 40rem;
    height: 20rem;
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

.modal-content {
    width: 100%;
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

.small-screen {
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
        max-width: 18.5rem;
        max-height: 15rem;
    }


}
</style>