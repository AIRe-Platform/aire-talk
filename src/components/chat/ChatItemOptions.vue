<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->

<script setup lang="ts">
import { l } from '@/locales';
import { ChatMessage } from '@/models/chat';
import { useClipboard } from '@vueuse/core';
import { computed, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { vOnClickOutside } from '@vueuse/components';
import { AireContent } from 'aire';
import useChat from '@/context/chat';
import useContent from '@/context/content';
import DialogModal from "@/components/layout/DialogModal.vue";
import Tooltip from "@/components/common/Tooltip.vue";
import { listChatKeywords, rateMessage } from '@/helpers/chatUtils';
import useStatistics from '@/context/statistics';
import { ContentEvent, ContentEventName } from '@/models/statistics';

const props = defineProps<{
    parent: ChatMessage
    can_revert: boolean
    content?: AireContent
}>()

const optionsMenuRef = ref<HTMLElement | null>(null);
const clipboard = useClipboard();
const chat = useChat();
const contentContext = useContent();
const statistics = useStatistics();

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
        if (state.rating !== 0) {
            statistics.sendEvent(new ContentEvent(
                props.content.id,
                props.content.name,
                listChatKeywords().join(','),
                chat.id,
                state.rating === 1 ? ContentEventName.Liked : ContentEventName.Disliked
            ));
        }
    }
    else
        rateMessage(props.parent.id, state.rating);
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
    if (!optionsMenuRef.value?.contains(e.relatedTarget as Node)) {
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
    <DialogModal :active="state.confirmRevert" @focus-first-button="(btn: HTMLElement | null) => btn?.focus()" :buttons="[
        { loc_key: l.button_yes, onClick: onConfirmRevert },
        { loc_key: l.button_no, className: 'cancel-button', onClick: onCancelRevert }
    ]" question-id="confrirm-revert-dialog-modal">
        {{ $t(l.popup_confirm_revert_message) }}
    </DialogModal>
    <div class="chat-item-options">
        <button class="chat-item-options-button" type="button" @click.stop="onToggleMenu" aria-haspopup="true"
            :aria-label="state.menuOpen ? $t(l.screen_recorder_close_message_menu) : $t(l.screen_recorder_open_message_menu)"
            :aria-expanded="state.menuOpen" :class="{ 'is-content': props.content !== undefined }">
            <div v-if="state.menuOpen">
                <div class="icon chat-option-desktop"></div>
            </div>
            <Tooltip v-else :text="$t(l.tooltip_message_options)" position="left">
                <div class="icon chat-option-desktop"></div>
            </Tooltip>
        </button>
        <div class="chat-item-options-menu" ref="optionsMenuRef" v-if="state.menuOpen"
            v-on-click-outside="onToggleMenu">
            <Tooltip :text="$t(l.tooltip_thumbs_up)" position="left">
                <button @click.stop="onThumbsUp" type="button" :tabindex="optionsMenuTabindex"
                    :aria-label=$t(l.screen_recorder_thumbs_up) class="chat-item-options-menu-button thumbs-up"
                    :class="{ 'is-selected': state.rating > 0 }">
                    <font-awesome-icon icon="fa-solid fa-thumbs-up" />
                </button>
            </Tooltip>
            <Tooltip :text="$t(l.tooltip_thumbs_down)" position="left">
                <button @click.stop="onThumbsDown" type="button" :tabindex="optionsMenuTabindex"
                    :aria-label=$t(l.screen_recorder_thumbs_down) class="chat-item-options-menu-button thumbs-down"
                    :class="{ 'is-selected': state.rating < 0 }">
                    <font-awesome-icon icon="fa-solid fa-thumbs-down" />
                </button>
            </Tooltip>
            <template v-if="!props.content">
                <Tooltip :text="$t(state.copiedToClipboard ? l.tooltip_message_copied :
                    l.tooltip_copy_message)" position="left">
                    <button @click.stop="onCopyClipboard" type="button" :tabindex="optionsMenuTabindex"
                        :aria-label="state.copiedToClipboard ? $t(l.screen_recorder_copied_text_clipboard) : $t(l.screen_recorder_copy_text_clipboard)"
                        class="chat-item-options-menu-button check" :class="{ 'is-selected': state.copiedToClipboard }">
                        <font-awesome-icon :icon="['fa-solid', state.copiedToClipboard ? 'fa-check' : 'fa-copy']" />
                    </button>
                </Tooltip>
                <Tooltip :text="$t(l.tooltip_revert_message)" position="left" v-if="props.can_revert">
                    <button @click.stop="onRevert" type="button" :tabindex="optionsMenuTabindex"
                        :aria-label=$t(l.screen_recorder_revert_here)
                        class="chat-item-options-menu-button fa-arrows-spin">
                        <font-awesome-icon icon="fa-solid fa-arrows-spin" />
                    </button>
                </Tooltip>
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
    border: none;
    border-radius: 0.6rem;
    padding: 0;
    background-color: transparent;
    transition: background-color 0.25s;
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
    z-index: 3;
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