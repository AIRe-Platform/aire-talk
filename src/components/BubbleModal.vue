<script setup lang="ts">
import SurveyQuestion from './SurveyQuestion.vue'
import { ChatMessage } from '@/models/chat';
import { defineProps } from 'vue';

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
        <div v-show="active" class="modal">
            <transition name="modal-animation-inner">
                <div class="modal-inner">
                    <div class="modal-component">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h1>{{ props.parent.sender }}</h1>
                            </div>
                            <div class="modal-body">
                                <p v-if="!props.parent.question"> {{ props.parent.message }}</p>
                                <div class="modal-body-image" v-if="props.parent.image">
                                    <img v-bind:src="props.parent.image" class="chat-message-image-contain">
                                </div>
                                <div class="modal-body-video-container" v-if="props.parent.video">
                                    <video class="modal-body-video" controls>
                                        <source v-bind:src="props.parent.video" type="video/mp4">
                                    </video>
                                </div>
                                <SurveyQuestion v-if="props.parent.question" :question="props.parent.question" />
                            </div>
                        </div>
                        <div class="modal-button" @click="close">
                            <font-awesome-icon icon="fa-solid fa-xmark" />
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
    z-index: 2;
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
    height: 100vh;
    width: 100vw;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(255, 255, 255, 0.5);
    z-index: 1;

    .modal-inner {
        position: relative;
        max-width: 640px;
        width: 80%;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        background-color: #fff;
        background-color: var(--panel-background-color);
        padding: 2rem;
        border-radius: 5px;
        border: solid 1px gray;

        i {
            position: absolute;
            top: 15px;
            right: 15px;
            font-size: 20px;
            cursor: pointer;

            &:hover {
                color: crimson;
            }
        }

        button {
            padding: 20px 30px;
            border: none;
            font-size: 16px;
            background-color: crimson;
            color: #fff;
            cursor: pointer;
        }
    }
}

/* mobile*/
@media screen and (max-width: 600px) {
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