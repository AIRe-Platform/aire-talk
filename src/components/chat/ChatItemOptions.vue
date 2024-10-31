<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->

<script setup lang="ts">
import { l } from '@/locales';
import { ChatMessage } from '@/models/chat';
import { useClipboard } from '@vueuse/core';
import { computed, defineProps, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { vOnClickOutside } from '@vueuse/components';
import { AireContent } from 'aire';
import useChat from '@/context/chat';
import useContent from '@/context/content';
import DialogModal from "@/components/layout/DialogModal.vue";
import { adjustTooltipPosition } from '@/helpers/tooltipUtils';

const props = defineProps<{
    parent: ChatMessage
    can_revert: boolean
    content?: AireContent
}>()

const optionsMenuRef = ref<HTMLElement | null>(null);
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
});

const focusOutListener = (e: FocusEvent) => {
    if(!optionsMenuRef.value?.contains(e.relatedTarget as Node)) {
        onToggleMenu(e);
    }
};

onUnmounted(() => optionsMenuRef.value?.removeEventListener('focusout', focusOutListener));

watch(() => state.menuOpen, (menuOpen) => {
    if (menuOpen) {
        nextTick(() => {
            optionsMenuRef.value?.addEventListener('focusout', focusOutListener);
        })
    } else {
        optionsMenuRef.value?.removeEventListener('focusout', focusOutListener);
    }
});

const optionsMenuTabindex = computed(() => state.menuOpen ? 0 : -1);
</script>

<template>
    <DialogModal :active="state.confirmRevert"
    @focus-first-button="(btn: HTMLElement | null) => btn?.focus()"
    :buttons="[
        { loc_key: l.button_accept, onClick: onConfirmRevert },
        { loc_key: l.button_cancel, className: 'cancel-button', onClick: onCancelRevert }
    ]">
        {{ $t(l.popup_confirm_revert_message) }}
    </DialogModal>
    <div class="chat-item-options">
        <div class="chat-item-options-button"
            tabindex="0"
            @keydown.prevent.space.enter="onToggleMenu"
            @click.stop="onToggleMenu"
            aria-haspopup="true"
            :aria-expanded="state.menuOpen"
            :class="{ 'is-content': props.content !== undefined }">
            <div v-if="state.menuOpen" class="icon chat-option-desktop tooltip">
                <span class="tooltiptext">{{ $t(l.tooltip_message_options) }}</span>
            </div>
            <div v-if="!state.menuOpen" class="icon chat-option-desktop tooltip"
                @mouseenter="adjustTooltipPosition($event, false)">
                <span class="tooltiptext">{{ $t(l.tooltip_message_options) }}</span>
            </div>
        </div>
        <div class="chat-item-options-menu"
            ref="optionsMenuRef"
            v-if="state.menuOpen"
            v-on-click-outside="onToggleMenu">
            <div @click.stop="onThumbsUp"
                role="button"
                :tabindex="optionsMenuTabindex"
                @keydown.prevent.space.enter="onThumbsUp"
                class="chat-item-options-menu-button thumbs-up tooltip"
                @mouseenter="adjustTooltipPosition($event, true)"
                :class="{ 'is-selected': state.rating > 0 }">
                <font-awesome-icon icon="fa-solid fa-thumbs-up" />
                <span class="tooltiptext">{{ $t(l.tooltip_thumbs_up) }}</span>
            </div>
            <div @click.stop="onThumbsDown"
                role="button"
                :tabindex="optionsMenuTabindex"
                @keydown.prevent.space.enter="onThumbsDown"
                class="chat-item-options-menu-button thumbs-down tooltip"
                @mouseenter="adjustTooltipPosition($event, true)"
                :class="{ 'is-selected': state.rating < 0 }">
                <font-awesome-icon icon="fa-solid fa-thumbs-down" />
                <span class="tooltiptext">{{ $t(l.tooltip_thumbs_down) }}</span>
            </div>
            <template v-if="!props.content">
                <div @click.stop="onCopyClipboard"
                    role="button"
                    :tabindex="optionsMenuTabindex"
                    @keydown.prevent.space.enter="onCopyClipboard"
                    class="chat-item-options-menu-button check tooltip"
                    @mouseenter="adjustTooltipPosition($event, false)"
                    :class="{ 'is-selected': state.copiedToClipboard }">
                    <font-awesome-icon :icon="['fa-solid', state.copiedToClipboard ? 'fa-check' : 'fa-copy']" />
                    <span class="tooltiptext">{{ $t(state.copiedToClipboard ? l.tooltip_message_copied : l.tooltip_copy_message) }}</span>
                </div>
                <div @click.stop="onRevert"
                    role="button"
                    :tabindex="optionsMenuTabindex"
                    @keydown.prevent.space.enter="onRevert"
                    class="chat-item-options-menu-button spin tooltip"
                    @mouseenter="adjustTooltipPosition($event, false)"
                    v-if="props.can_revert">
                    <font-awesome-icon icon="fa-solid fa-arrows-spin" />
                    <span class="tooltiptext">{{ $t(l.tooltip_revert_message) }}</span>
                </div>
            </template>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.chat-item-options {
    position: relative;
}

.chat-item-options-button {
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

.chat-item-options-menu-button {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3rem;
    height: 2rem;
    border: 1.5px solid var(--chat-bubble-options-button-hover);
    background-color: var(--chat-options-menu-background);
    border-radius: 0.5rem;
    color: var(--button-color);

    &:hover {
        background-color: var(--chat-bubble-options-button-hover);
        border-color: var(--box-stroke);
    }
}

.thumbs-down {
    color: var(--delete-color);
}

.chat-item-options-menu {
    position: absolute;
    display: flex;
    flex-direction: column;
    right: -1rem;
    top: 1.2rem;
    gap: 0.2rem;
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
    .chat-item-options-menu {
        top: -1rem;
        right: 1rem;
        flex-direction: row;
    }
}
</style>