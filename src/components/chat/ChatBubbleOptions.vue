<script setup lang="ts">
import { l } from '@/locales';
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import { revertToMessage, setMessageRating, setContentRating } from '@/context/chat';
import { ChatMessage } from '@/models/chat';
import { useClipboard } from '@vueuse/core';
import { defineProps, ref } from 'vue';
import { vOnClickOutside } from '@vueuse/components';
import { Content } from 'aire';

const props = defineProps<{
    parent: ChatMessage
    can_revert: boolean
    is_content?: boolean
    content?: Content
}>()

const clipboard = useClipboard()

const menuOpen = ref(false)
const copiedToClipboard = ref(false)
const confirmRevertOpen = ref(false)
const thumbsUpSelected = ref(false);
const thumbsDownSelected = ref(false);
const onToggleMenu = (e: Event) => {
    e.stopImmediatePropagation();
    menuOpen.value = !menuOpen.value
}

const onThumbsUp = () => {
    if (props.is_content && props.content) {
        if (!thumbsUpSelected.value && !thumbsDownSelected.value) {
            //console.log("onThumbsUp: UP: 0 DOWN: 0 ---> UP: 1 DOWN: 0 ");
            setContentRating(props.content, 1);
            thumbsUpSelected.value = !thumbsUpSelected.value;
            thumbsDownSelected.value = false;
        } else if (thumbsUpSelected.value && !thumbsDownSelected.value) {
            //console.log("onThumbsUp: UP: 1 DOWN: 0 ---> UP: 0 DOWN: 0 ");
            setContentRating(props.content, -1);
            thumbsUpSelected.value = false;
            thumbsDownSelected.value = false;
        } else if (!thumbsUpSelected.value && thumbsDownSelected.value) {
            //console.log("onThumbsUp: UP: 0 DOWN: 1 ---> UP: 1 DOWN: 0 ");
            setContentRating(props.content, 2);
            thumbsUpSelected.value = true;
            thumbsDownSelected.value = false;
        } else {
            console.error("onThumbsUp: UP: 1 DOWN: 1 ---> not an opcion. check this out ");
        }
    } else {
        setMessageRating(props.parent.id, 1);
    }
}

const onThumbsDown = () => {
    if (props.is_content && props.content) {
        if (!thumbsUpSelected.value && !thumbsDownSelected.value) {
            //console.log("onThumbsDown: UP: 0 DOWN: 0 ---> UP: 0 DOWN: 1 ");
            setContentRating(props.content, -1);
            thumbsUpSelected.value = false;
            thumbsDownSelected.value = !thumbsDownSelected.value;
        } else if (!thumbsUpSelected.value && thumbsDownSelected.value) {
            //console.log("onThumbsDown: UP: 0 DOWN: 1 ---> UP: 0 DOWN: 0 ");
            setContentRating(props.content, 1);
            thumbsUpSelected.value = false;
            thumbsDownSelected.value = false;
        } else if (thumbsUpSelected.value && !thumbsDownSelected.value) {
            //console.log("onThumbsDown: UP: 1 DOWN: 0 ---> UP: 0 DOWN: 1 ");
            setContentRating(props.content, -2);
            thumbsUpSelected.value = false;
            thumbsDownSelected.value = true;
        } else {
            console.error("onThumbsDown: UP: 1 DOWN: 1 ---> not an opcion. check this out");
        }
    } else {
        setMessageRating(props.parent.id, -1);
    }
}

const onCopyClipboard = async () => {
    if (props.parent.message) {
        await clipboard.copy(props.parent.message)
        copiedToClipboard.value = !copiedToClipboard.value;
    }
}

const onConfirmRevert = () => {
    revertToMessage(props.parent.id)
    confirmRevertOpen.value = false;
}

const onRevert = () => {
    menuOpen.value = false;
    confirmRevertOpen.value = true;
}

const onCancelRevert = () => {
    confirmRevertOpen.value = false;
}

</script>

<template>
    <ConfirmDialog v-if="confirmRevertOpen" v-on:accept="onConfirmRevert" v-on:decline="onCancelRevert">
        {{ $t(l.popup_confirm_revert_message) }}
    </ConfirmDialog>
    <div class="chat-bubble-options">
        <div class="chat-bubble-options-button" @click.stop="onToggleMenu" :class="{ 'is-content': props.is_content }">
            <div class="icon chat-option-desktop">
            </div>
        </div>
        <div class="chat-bubble-options-menu" v-if="menuOpen" v-on-click-outside="onToggleMenu">
            <button @click.stop="onThumbsUp" class="chat-message-answer-options-menu-button thumbs-up"
                :class="{ 'is-selected': props.parent.rating > 0 || thumbsUpSelected }">
                <font-awesome-icon icon="fa-solid fa-thumbs-up" />
            </button>
            <button @click.stop="onThumbsDown" class="chat-message-answer-options-menu-button thumbs-down"
                :class="{ 'is-selected': props.parent.rating < 0 || thumbsDownSelected }">
                <font-awesome-icon icon="fa-solid fa-thumbs-down" />
            </button>
            <button @click.stop="onCopyClipboard" class="chat-message-answer-options-menu-button check"
                :class="{ 'is-selected': copiedToClipboard }" v-if="copiedToClipboard && !props.is_content">
                <font-awesome-icon icon="fa-solid fa-check" />
            </button>
            <button @click.stop="onCopyClipboard" class="chat-message-answer-options-menu-button copy"
                v-if="!copiedToClipboard && !props.is_content">
                <font-awesome-icon icon="fa-solid fa-copy" />
            </button>
            <button @click.stop="onRevert" class="chat-message-answer-options-menu-button spin"
                v-if="props.can_revert && !props.is_content">
                <font-awesome-icon icon="fa-solid fa-arrows-spin" />
            </button>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.chat-bubble-options {
    position: relative;
}

.ellipsis-vertical {}

.chat-bubble-options-button {
    position: absolute;
    top: -1.1rem;
    right: -1.6rem;
    width: 1.3rem;
    height: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: var(--chat-bubble-background-color);
    border-radius: 0.6rem;
    transition: background-color 0.25s;

    &:hover {
        background-color: var(--accent-primary-color);
    }
}


.thumbs-up,
.copy,
.spin {
    color: var(--button-color);

    &:hover {
        background-color: var(--chat-bubble-options-button-hover);
        border-color: transparent;
        color: var(--button-color);
        border-color: var(--stroke);
    }
}

.check {
    color: var(--questionnaire-icon-background);

    &:hover {
        background-color: var(--user-chat-box-background);
        border-color: transparent;
        color: var(--questionnaire-icon-background);
        border-color: var(--stroke);
    }
}

.thumbs-down {
    color: var(--delete-color);

    &:hover {
        background-color: var(--user-chat-box-background);
        border-color: transparent;
        color: var(--delete-color);
        border-color: var(--stroke);
    }
}

.chat-bubble-options-menu {
    position: absolute;
    display: flex;
    flex-direction: column;
    right: -4.5rem;
    top: 0;
    gap: 0.2rem;
}

.chat-message-answer-options-menu-button {
    cursor: pointer;
    background-color: var(--chat-options-menu-background) !important;
}

.is-selected {
    background-color: var(--chat-bubble-options-button-hover) !important;
}

.is-content {
    top: -0.4rem;
    right: -0.7rem;
}

/* mobile*/
.ui-mode-mobile {
    .chat-bubble-options-menu {
        top: -1rem;
        right: 1rem;
        flex-direction: row;
    }
}
</style>