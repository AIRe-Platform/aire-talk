<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->

<script setup lang="ts">
import { l } from "@/locales";
import { defineEmits, onMounted, reactive } from "vue";
import { router } from "@/router";
import { vOnClickOutside } from "@vueuse/components";
import { UIState, UIPanels } from "@/context/ui";
import useChat from "@/context/chat";
import { getAllChats } from "@/helpers/chatUtils";
import { useChatCache } from "@/context/cache";
import { closeBurgerMenu, refreshBurgerMenuButtonsRef } from "@/context/ui";
import { adjustTooltipPosition } from '@/helpers/tooltipUtils';

import Spinner from "@/components/common/Spinner.vue";
import DialogModal from "@/components/layout/DialogModal.vue";
import { ChatMessageType } from "@/models/chat";


interface ChatLogItem {
    id: string;
    time: Date;
}

const chat = useChat();
const cache = useChatCache();

const state = reactive<{
    busy: boolean,
    deleteId?: string,
    confirmDelete: boolean,
    items?: ChatLogItem[]
}>({
    busy: false,
    confirmDelete: false
});

const emit = defineEmits<{
    closePanel: [e: any];
}>();

const refresh = () => {
    state.busy = true;
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
            refreshBurgerMenuButtonsRef();
        })
};
onMounted(refresh);

const isOpen = (id: string) => {
    return id === chat.id;
};

const onSelect = async (id: string) => {
    if (isOpen(id))
        return;

    const open = await chat.open(id);
    if (open)
        router.push("/chat");

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
            .finally(() => { state.deleteId = undefined; });
    }
};

const onCancelDelete = () => {
    state.confirmDelete = false;
    state.deleteId = undefined;
};

const onDeleteChat = async (id: string) => {
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
</script>

<template>
    <DialogModal :active="state.confirmDelete" :buttons="[
        { loc_key: l.button_accept, onClick: onConfirmDelete },
        { loc_key: l.button_cancel, className: 'cancel-button', onClick: onCancelDelete }
    ]">
        {{ $t(l.popup_confirm_remove_chat) }}
    </DialogModal>
    <div class="chat-history-panel" v-on-click-outside="onClickOutside">
        <div class="chat-history-list">
            <div class="chat-history-busy" v-if="state.busy">
                <Spinner />
            </div>
            <div class="chat-history-item" v-for="item in state.items" v-bind:key="item.id"
                :class="{ 'restore-chat-item-open': isOpen(item.id) }">
                <div class="chat-history-item-row">
                    <div class="chat-history-item-details" @click="onSelect(item.id)">
                        <div class="chat-history-item-date">
                            {{ item.time.toLocaleString($i18n.locale) }}
                        </div>
                        <div class="chat-history-item-preview">
                            {{ getLastMessage(item.id) || $t(l.chat_history_loading) }}
                        </div>
                        <div class="chat-history-token" v-if="getTokenCount(item.id)">
                            {{ $t(l.chat_history_tokens, [getTokenCount(item.id)]) }}
                        </div>
                    </div>
                    <div class="chat-history-item-delete" @click="onDeleteChat(item.id)">
                        <div class="icon delete-bin tooltip" @mouseenter="adjustTooltipPosition($event, false, 'top')">
                            <span class="tooltiptext">{{
                                $t(l.tooltip_delete_chat) }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.chat-history-panel {
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
    transition: color 0.25s;

    &:hover {
        color: var(--accent-primary-color);
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
