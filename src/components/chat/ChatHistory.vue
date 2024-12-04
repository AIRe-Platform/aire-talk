<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->

<script setup lang="ts">
import { l } from "@/locales";
import { defineEmits, nextTick, onMounted, onUnmounted, reactive, ref, watch } from "vue";
import { router } from "@/router";
import { vOnClickOutside } from "@vueuse/components";
import { UIState, UIPanels, UISettings } from "@/context/ui";
import useChat from "@/context/chat";
import { getAllChats } from "@/helpers/chatUtils";
import { useChatCache } from "@/context/cache";
import { closeBurgerMenu, refreshBurgerMenuButtonsRef } from "@/context/ui";
import { showSpinner, hideSpinner, SpinnerId } from '@/helpers/spinnerUtils';

import Spinner from "@/components/common/Spinner.vue";
import DialogModal from "@/components/layout/DialogModal.vue";
import { ChatMessageType } from "@/models/chat";
import Tooltip from "@/components/common/Tooltip.vue";

interface ChatLogItem {
    id: string;
    time: Date;
}

const chat = useChat();
const cache = useChatCache();
const chatHistoryPanelRef = ref<HTMLElement | null>(null);
const deleteMessageRef = ref<HTMLElement | null>(null);

const state = reactive<{
    busy: boolean,
    deleteId?: string,
    confirmDelete: boolean,
    lastFocusedItem: HTMLElement | null
    items?: ChatLogItem[]
    showChatDeletedMessage: boolean
}>({
    busy: false,
    confirmDelete: false,
    lastFocusedItem: null,
    showChatDeletedMessage: false,
});

const emit = defineEmits<{
    closePanel: [e: any];
}>();

const refresh = () => {
    state.busy = true;
    showSpinner(SpinnerId.ChatHistory);
    getAllChats()
        .then(logs => {
            state.items = logs.map((x) => {
                chat.load(x.id);

                let item: ChatLogItem = {
                    id: x.id,
                    time: new Date(x.time),
                };

                return item;
            });
        })
        .finally(() => {
            state.busy = false;
            hideSpinner();
            refreshBurgerMenuButtonsRef();
        });
};

const focusOutListener = (e: FocusEvent) => {
    const relTarget = e.relatedTarget as Node;
    const target = e.target as Element;
    if (
        !chatHistoryPanelRef.value?.contains(relTarget) &&
        !target.closest('.modal')
    ) {
        UIState.panels.delete(UIPanels.ChatHistory);
    }
};

onMounted(() => {
    refresh();
    chatHistoryPanelRef.value?.addEventListener('focusout', focusOutListener);
});

onUnmounted(() => chatHistoryPanelRef.value?.removeEventListener('focusout', focusOutListener));

const isOpen = (id: string) => {
    return id === chat.id;
};

const onSelect = async (id: string) => {
    if (isOpen(id)) {
        UIState.panels.delete(UIPanels.ChatHistory);
        await closeBurgerMenu();
        UIState.isNavMenuCompressed = false;
        UIState.showMenu = false;
        return;
    }

    router.push({
        name: "Chat",
        params: { id: id }
    });

    UIState.panels.delete(UIPanels.ChatHistory);
    await closeBurgerMenu();
    emit("closePanel", undefined);
    UIState.showMenu = false;
    UIState.isNavMenuCompressed = false;
};

const onConfirmDelete = () => {
    state.confirmDelete = false;
    if (state.deleteId) {
        chat.delete(state.deleteId)
            .then(() => {
                if (state.items) {
                    const i = state.items.findIndex(x => x.id === state.deleteId);
                    if (i > -1)
                        state.items.splice(i, 1);
                }
            })
            .finally(() => {
                state.lastFocusedItem = null;
                state.deleteId = undefined;
                state.showChatDeletedMessage = true;
            });
    }
};

const onCancelDelete = () => {
    if (state.lastFocusedItem) {
        state.lastFocusedItem.focus();
        state.lastFocusedItem = null;
    }
    state.confirmDelete = false;
    state.deleteId = undefined;
};

const onDeleteChat = async (id: string, e: Event) => {
    state.lastFocusedItem = e.target as HTMLElement;
    state.deleteId = id;
    state.confirmDelete = true;
};

const getLastMessage = (id: string) => {
    const log = cache.get(id);
    if (!log)
        return undefined;

    return log.messages.findLast(x => x.type == ChatMessageType.Default && x.content)?.content || "";
};

const getTokenCount = (id: string) => {
    const log = cache.get(id);
    const tokenCount = log?.stats?.token_count;
    if (tokenCount)
        return tokenCount;
    else return undefined;

};

const onClickOutside = async (e: Event) => {
    //If clicking outside of chatHistory panel is just clicking again in button of chat history => do nothing
    if (UIState.chatHistoryButtonRef && UIState.chatHistoryButtonRef.contains(e.target as Node)) {
        e.stopImmediatePropagation();
        //If it is settings panel switch between them
    } else if (UIState.settingsButtonRef && UIState.settingsButtonRef.contains(e.target as Node)) {
        UIState.panels.delete(UIPanels.ChatHistory);
        UIState.panels.add(UIPanels.Settings);
        e.stopImmediatePropagation();
    } else {
        if (!state.deleteId) {
            UIState.panels.delete(UIPanels.ChatHistory);

            await closeBurgerMenu();
            UIState.isNavMenuCompressed = false;
            UIState.showMenu = false;
        }
    }
};

watch(() => state.showChatDeletedMessage, (newVal) => {
    if (newVal) {
        nextTick(() => {
            deleteMessageRef.value?.focus();
            setTimeout(() => {
                state.showChatDeletedMessage = false;
                chatHistoryPanelRef.value?.querySelector('a')?.focus();
            }, 5000);
        })
    }
});
</script>

<template>
    <div ref="chatHistoryPanelRef" class="chat-history-wrapper">
        <DialogModal :active="state.confirmDelete" :show-close-button="false" :buttons="[
            { loc_key: l.button_yes, onClick: onConfirmDelete },
            { loc_key: l.button_no, className: 'cancel-button', onClick: onCancelDelete }
        ]" @focus-first-button="(btn: HTMLElement | null) => btn?.focus()"
            question-id="confirm-remove-chat-dialog-modal">
            {{ $t(l.popup_confirm_remove_chat) }}
        </DialogModal>
        <div class="chat-history-panel" v-on-click-outside="onClickOutside">
            <div class="chat-history-list">
                <div class="chat-history-busy" v-if="state.busy">
                    <Spinner :id="SpinnerId.ChatHistory" />
                </div>
                <div v-if="state.showChatDeletedMessage" class="notification-message" ref="deleteMessageRef"
                    tabindex="-1">
                    {{ $t(l.chat_history_delete_success) }}
                </div>
                <div class="chat-history-item" v-for="item in state.items" v-bind:key="item.id"
                    :class="{ 'restore-chat-item-open': isOpen(item.id) }">
                    <div class="chat-history-item-row">
                        <a href="#" class="chat-history-item-details" tabindex="0" role="link"
                            @keydown.prevent.space.enter="onSelect(item.id)" @click="onSelect(item.id)">
                            <div class="chat-history-item-date">
                                {{ item.time.toLocaleString($i18n.locale) }}
                            </div>
                            <div class="chat-history-item-preview">
                                {{ getLastMessage(item.id) || $t(l.chat_history_loading) }}
                            </div>
                            <div class="chat-history-token" v-if="UISettings.tokensEnabled && getTokenCount(item.id)">
                                {{ $t(l.chat_history_tokens, [getTokenCount(item.id)]) }}
                            </div>
                        </a>
                        <button class="chat-history-item-delete" role="button" @click="onDeleteChat(item.id, $event)"
                            :aria-label="$t(l.tooltip_delete_chat)">
                            <Tooltip :text="$t(l.tooltip_delete_chat)" position="top" :useMaxContent="false"
                                :adjustPosition="true">
                                <div class="icon delete-bin"></div>
                            </Tooltip>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.chat-history-wrapper {
    height: 100%;
}

.chat-history-panel {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    width: 24rem;
    height: 100%;
    background-color: var(--panel-menu-background-color);
    border-radius: 1rem;
    border: 1px solid var(--border-color);
    box-shadow: 0 0 5px var(--shadow-color);
    overflow: hidden;
    margin: 0;
    margin-left: 15.5rem;
}

.chat-history-busy {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
}

.chat-history-list {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 1rem;
    gap: 1rem;
}

.chat-history-item {
    display: flex;
    flex-direction: row;
    flex-shrink: 0;

    cursor: pointer;
    min-height: 4rem;
    width: 100%;

    border-radius: 10px;
    box-shadow: 0 0 5px var(--shadow-color);
    background-color: var(--background-color);
}

.restore-chat-item-open {
    cursor: default;
    background-color: var(--chat-menu-active);
}

.chat-history-item-details {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    align-self: flex-start;
    gap: 0.5rem;
}

.chat-history-item-row {
    display: flex;
    flex-direction: row;
    width: 100%;
    padding: 1rem;
    gap: 1rem;
    align-items: center;
}

.chat-history-item-delete {
    cursor: pointer;
    padding: 0.5rem;
    color: var(--delete-color);
    border: none;
    background-color: transparent;
    transition: color 0.25s;

    &:hover {
        color: var(--hover-text);
    }
}

.chat-history-item-delete svg {
    width: auto;
    height: 2rem;
}

.chat-history-item-date {
    font-size: var(--font-small);
    color: var(--chat-history-item-date);
    font-weight: 700;
}

.chat-history-item-preview {
    max-height: 2rem;
    margin-right: 1rem;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: var(--font-small);
    color: var(--chat-history-text-color);
}

.chat-history-token {
    font-size: var(--font-small);
    color: var(--chat-history-text-color);
}

.restore-chat-button-close {
    cursor: pointer;
    position: absolute;
    right: -3rem;
}

.notification-message {
    inset: .5rem 1rem auto 1rem;
    z-index: 1;
    text-align: center;
}

@media screen and ((max-aspect-ratio: 1/1) or (max-width: 920px)) {
    .chat-history-panel {
        width: 80%;
        z-index: 10;
        padding: 0.5rem;
        max-height: 80%;
        margin-left: 4rem;
    }

    .chat-history-item {
        justify-content: flex-start;
    }

    .chat-history-item-row {
        gap: 0;
    }
}

@media screen and (max-width: 376px) {
    .chat-history-item-row {
        flex-direction: column;
    }

    .chat-history-item-preview {
        margin-right: 0;
    }

    .chat-history-item-delete {
        padding-bottom: 0;
    }
}
</style>
