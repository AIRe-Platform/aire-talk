<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->

<script setup lang="ts">
import { l } from '@/locales';
import { ChatMessage } from '@/models/chat';
import { useClipboard } from '@vueuse/core';
import { defineProps, onMounted, reactive } from 'vue';
import { vOnClickOutside } from '@vueuse/components';
import { AireContent } from 'aire';
import useChat from '@/context/chat';
import useContent from '@/context/content';
import DialogModal from "@/components/layout/DialogModal.vue";

const props = defineProps<{
    parent: ChatMessage
    can_revert: boolean
    content?: AireContent
}>()

const clipboard = useClipboard()
const chat = useChat();
const contentContext = useContent();

const state = reactive<{
    menuOpen: boolean,
    copiedToClipboard: boolean,
    confirmRevert: boolean,
    rating: number
}>({
    menuOpen: false,
    copiedToClipboard: false,
    confirmRevert: false,
    rating: 0
});

const onToggleMenu = (e: Event) => {
    e.stopImmediatePropagation();
    state.menuOpen = !state.menuOpen;
}

const onThumbsUp = () => {
    if (state.rating > 0)
        state.rating = 0;
    else
        state.rating = 1;

    applyRating();
}

const onThumbsDown = () => {
    if (state.rating < 0)
        state.rating = 0;
    else
        state.rating = -1;

    applyRating();
}

const applyRating = () => {
    if (props.content?.id) {
        contentContext.vote(props.content.id, state.rating);
    }
    else
        chat.rateMessage(props.parent.id, state.rating);
}


const onCopyClipboard = async () => {
    try {
        if (props.parent.content) {
            await clipboard.copy(props.parent.content);
            state.copiedToClipboard = true;
        }
    } catch (error) {
        console.error('Error copying to clipboard in ChatBubbleOptions:', error);
        state.copiedToClipboard = false;
    }
};

const onConfirmRevert = () => {
    chat.revertTo(props.parent.id)
    state.confirmRevert = false;
}

const onRevert = () => {
    state.menuOpen = false;
    state.confirmRevert = true;
}

const onCancelRevert = () => {
    state.confirmRevert = false;
}

onMounted(() => {
    if (props.content?.id) {
        contentContext.getVote(props.content.id).then(vote => {
            state.rating = vote;
        })
    }
    else {
        state.rating = props.parent.rating || 0;
    }
})
</script>

<template>
    <DialogModal :active="state.confirmRevert" :buttons="[
        { loc_key: l.button_accept },
        { loc_key: l.button_cancel },
    ]" @select="(i: number) => {
        switch (i) {
            case 0:
                onConfirmRevert();
                break;

            default:
            case 1:
                onCancelRevert();
                break;
        }
    }">
        {{ $t(l.popup_confirm_revert_message) }}
    </DialogModal>
    <div class=" chat-bubble-options">
        <div class="chat-bubble-options-button" @click.stop="onToggleMenu"
            :class="{ 'is-content': props.content !== undefined }">
            <div class="icon chat-option-desktop">
            </div>
        </div>
        <div class="chat-bubble-options-menu" v-if="state.menuOpen" v-on-click-outside="onToggleMenu">
            <button @click.stop="onThumbsUp" class="chat-message-answer-options-menu-button thumbs-up"
                :class="{ 'is-selected': state.rating > 0 }">
                <font-awesome-icon icon="fa-solid fa-thumbs-up" />
            </button>
            <button @click.stop="onThumbsDown" class="chat-message-answer-options-menu-button thumbs-down"
                :class="{ 'is-selected': state.rating < 0 }">
                <font-awesome-icon icon="fa-solid fa-thumbs-down" />
            </button>
            <template v-if="!props.content">
                <button @click.stop="onCopyClipboard" class="chat-message-answer-options-menu-button check"
                    :class="{ 'is-selected': state.copiedToClipboard }" v-if="state.copiedToClipboard">
                    <font-awesome-icon icon="fa-solid fa-check" />
                </button>
                <button @click.stop="onCopyClipboard" class="chat-message-answer-options-menu-button copy"
                    v-if="!state.copiedToClipboard">
                    <font-awesome-icon icon="fa-solid fa-copy" />
                </button>
                <button @click.stop="onRevert" class="chat-message-answer-options-menu-button spin"
                    v-if="props.can_revert">
                    <font-awesome-icon icon="fa-solid fa-arrows-spin" />
                </button>
            </template>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.chat-bubble-options {
    position: relative;
}

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
@media screen and ((max-aspect-ratio: 1/1) or (max-width: 920px)) {
    .chat-bubble-options-menu {
        top: -1rem;
        right: 1rem;
        flex-direction: row;
    }
}
</style>