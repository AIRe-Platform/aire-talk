<script setup lang="ts">
import { l } from '@/locales';
import ConfirmDialog from './ConfirmDialog.vue';
import { revertToMessage, setMessageRating } from '@/context/chat';
import { ChatMessage } from '@/models/chat';
import { useClipboard } from '@vueuse/core';
import { defineProps, ref } from 'vue';
import { vOnClickOutside } from '@vueuse/components';

const props = defineProps<{
    parent: ChatMessage
    can_revert: boolean
}>()

const clipboard = useClipboard()

const menuOpen = ref(false)
const copiedToClipboard = ref(false)
const confirmRevertOpen = ref(false)

const onToggleMenu = () => {
    menuOpen.value = !menuOpen.value
}
const onThumbsUp = () => {
    setMessageRating(props.parent.id, 1);
}

const onThumbsDown = () => {
    setMessageRating(props.parent.id, -1);
}

const onCopyClipboard = async () => { 
    if(props.parent.message)
    {
        await clipboard.copy(props.parent.message)
        copiedToClipboard.value = !copiedToClipboard.value;
    }   
}

const onConfirmRevert = () => {
    revertToMessage(props.parent.id)
    confirmRevertOpen.value = false;
}

const onRevert = () => { 
    confirmRevertOpen.value = true;
}

const onCancelRevert = () => {
    confirmRevertOpen.value = false;
}

</script>

<template>
    <ConfirmDialog v-if="confirmRevertOpen" v-on:accept="onConfirmRevert"  v-on:decline="onCancelRevert">
        {{ $t(l.popup_confirm_revert_message) }}
    </ConfirmDialog>
    <div class="chat-bubble-options">
        <div class="chat-bubble-options-button" @click.stop="onToggleMenu">
            <font-awesome-icon icon="fa-solid fa-ellipsis-vertical" class="chat-bubble-options-icon" />
        </div>
        <div class="chat-bubble-options-menu" v-if="menuOpen" v-on-click-outside="onToggleMenu">
            <button @click.stop="onThumbsUp" class="chat-message-answer-options-menu-button"
                :class="{ 'is-selected': props.parent.rating > 0 }">
                <font-awesome-icon icon="fa-solid fa-thumbs-up" />
            </button>
            <button @click.stop="onThumbsDown" class="chat-message-answer-options-menu-button"
                :class="{ 'is-selected': props.parent.rating < 0 }">
                <font-awesome-icon icon="fa-solid fa-thumbs-down" />
            </button>
            <button @click.stop="onCopyClipboard" class="chat-message-answer-options-menu-button"
                :class="{ 'is-selected': copiedToClipboard }"
                v-if="copiedToClipboard"
            >
                <font-awesome-icon icon="fa-solid fa-check" />
            </button>
            <button @click.stop="onCopyClipboard" class="chat-message-answer-options-menu-button"
                v-if="!copiedToClipboard"
            >
                <font-awesome-icon icon="fa-solid fa-copy" />
            </button>
            <button @click.stop="onRevert" class="chat-message-answer-options-menu-button" v-if="props.can_revert">
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
    .chat-bubble-options-menu {
        top: -1rem;
        right: 1rem;
        flex-direction: row;
    }
}
</style>