<script setup lang="ts">
import { l } from "@/locales";
import { defineEmits, onMounted, reactive } from "vue";
import {
    Chat,
    deleteChat,
    getAllChats,
    loadChat,
    openChat,
    getCache,
} from "@/context/chat";
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import { router } from "@/router";
import { vOnClickOutside } from "@vueuse/components";
import { UIState, UIPanels } from "@/context/ui";
import Spinner from "@/components/Spinner.vue";
import useMobileLayout from "@/helpers/mobile";

interface ChatLogItem {
    id: string;
    time: Date;
}

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
                loadChat(x.id);

                let item: ChatLogItem = {
                    id: x.id,
                    time: new Date(x.time),
                };

                return item;
            });
        })
        .finally(() => {
            state.busy = false
        })
};
onMounted(refresh);

const isOpen = (id: string) => {
    return id === Chat.id;
};

const onSelect = async (id: string) => {
    if (isOpen(id))
        return;

    const open = await openChat(id);
    if (open)
        router.push("/chat");

    emit("closePanel", undefined);
    UIState.panels.delete(UIPanels.ChatHistory);


    UIState.showMenu = false;
};

const onConfirmDelete = () => {
    state.confirmDelete = false;
    if (state.deleteId) {
        deleteChat(state.deleteId)
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
    const log = getCache(id);
    if (!log)
        return undefined;

    return (
        log.messages[log.messages.length - 1].message ||
        log.messages[log.messages.length - 1].question?.question ||
        ""
    );
};

const getTokenCount = (id: string) => {
    const log = getCache(id);
    const tokenCount = log?.stats?.token_count;
    if (tokenCount)
        return tokenCount;
    else return undefined;

};

const onClickOutside = (e: Event) => {
    if (!state.deleteId) {
        e.stopImmediatePropagation();
        UIState.panels.delete(UIPanels.ChatHistory);
    }
};
</script>

<template>
    <ConfirmDialog v-if="state.confirmDelete" @accept="onConfirmDelete" @decline="onCancelDelete">
        {{ $t(l.popup_confirm_remove_chat) }}
    </ConfirmDialog>
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
                        <div class="icon delete-bin">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.chat-history-panel {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    z-index: 2;
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
    background-color: var(--menu-active);
}

.chat-history-item-details {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
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
    overflow: hidden;
    font-size: var(--font-small);
    color: black;
}

.chat-history-token {
    font-size: var(--font-small);
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
}
</style>
