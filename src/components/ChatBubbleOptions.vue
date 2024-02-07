<script setup lang="ts">
import { l } from '@/locales';
import ConfirmDialog from './ConfirmDialog.vue';
import { revertToMessage } from '@/context/chat';
import { ChatMessage } from '@/models/chat';
import { useClipboard } from '@vueuse/core';
import { defineProps, ref } from 'vue';

const props = defineProps<{
    parent: ChatMessage
    can_revert: boolean
}>()

const clipboard = useClipboard()

const menuOpen = ref(false)
const copiedToClipboard = ref(false)
const confirmRevertOpen = ref(false)

const onToggleMenu = (e: Event) => {
    menuOpen.value = !menuOpen.value
    e.stopPropagation()
}
const onThumbsUp = (e: Event) => {
    // TODO: Make a function into the chat context that sets the rating for a chat message.
    console.warn("Not implemented")
    e.stopPropagation()
}

const onThumbsDown = (e: Event) => {
    // TODO: Make a function into the chat context that sets the rating for a chat message.
    console.warn("Not implemented")
    e.stopPropagation()
}

const onCopyClipboard = async (e: Event) => {
    if (props.parent.message) {
        await clipboard.copy(props.parent.message)
        copiedToClipboard.value = true
    }
    // TODO: Change icon to checkmark
    e.stopPropagation()
}

const onConfirmRevert = (e: Event) => {
    revertToMessage(props.parent.id)
    confirmRevertOpen.value = false;
    e.stopPropagation()
}

const onRevert = (e: Event) => {
    confirmRevertOpen.value = true;
    e.stopPropagation()
}

const onCancelRevert = (e: Event) => {
    confirmRevertOpen.value = false;
    e.stopPropagation()
}

</script>

<template>
    <ConfirmDialog v-if="confirmRevertOpen" :accept="onConfirmRevert" :decline="onCancelRevert">
        {{ $t(l.popup_question_revert_message) }}
    </ConfirmDialog>
    <div class="chat-bubble-options">
        <div class="chat-bubble-options-button" @click="onToggleMenu">
            <font-awesome-icon icon="fa-solid fa-ellipsis-vertical" class="chat-bubble-options-icon" />
        </div>
        <div class="chat-bubble-options-menu" v-if="menuOpen">
            <button @click="onThumbsUp" class="chat-message-answer-options-menu-button"
                :class="{ 'is-selected': props.parent.rating || 0 > 0 }">
                <font-awesome-icon icon="fa-solid fa-thumbs-up" />
            </button>
            <button @click="onThumbsDown" class="chat-message-answer-options-menu-button"
                :class="{ 'is-selected': props.parent.rating || 0 < 0 }">
                <font-awesome-icon icon="fa-solid fa-thumbs-down" />
            </button>
            <button @click="onCopyClipboard" class="chat-message-answer-options-menu-button"
                :class="{ 'is-selected': copiedToClipboard }">
                <font-awesome-icon icon="fa-solid fa-copy" />
            </button>
            <button @click="onRevert" class="chat-message-answer-options-menu-button" v-if="props.can_revert">
                <font-awesome-icon icon="fa-solid fa-arrows-spin" />
            </button>
        </div>
    </div>
</template>

<style scoped>
.chat-bubble-options {
    position: relative;
}

.chat-bubble-options-button {
    position: absolute;
    top: -1.1rem;
    right: -1.6rem;
    width: 1.2rem;
    height: 1.2rem;

    display: flex;
    align-items: center;
    justify-content: center;

    cursor: pointer;

    background-color: var(--chat-bubble-background-color);
    border: 1px solid transparent;
    box-shadow: 0 0 3px gray;
    border-radius: 0.6rem;
}

.chat-bubble-options-menu {
    position: absolute;
    display: flex;
    flex-direction: column;
    right: -4.5rem;
    top: 0;
    gap: 0.2rem;
}

.chat-bubble-options-icon {
    height: 0.8rem;
    rotate: 90deg;
}

.chat-message-answer-options-menu-button {
    cursor: pointer;
}

/* mobile*/
@media screen and (max-width: 600px) {
    /* .chat-message-answer-options-menu-button {
        transform: scale(0.5);
    }

    .chat-bubble-options-menu {
        background-color: var(--chat-bubble-background-color);
        left: 19.5rem;
        width: 2rem;
        position: absolute;
        display: flex;
        height: -moz-fit-content;
        height: fit-content;
        align-items: center;
    } */
}
</style>