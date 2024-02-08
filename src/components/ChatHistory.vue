<script setup lang="ts">
import { l } from '@/locales';
import { defineEmits, onMounted, ref } from 'vue';
import { Chat, deleteChat, getAllChats, loadChat, openChat, getCache } from '@/context/chat';
import ConfirmDialog from './ConfirmDialog.vue';
import { router } from '@/router';

const emit = defineEmits<{
    closePanel: [e: any]
}>()

let delete_id: string | undefined;
const showConfirmModal = ref(false)

interface ChatLogItem {
    id: string,
    time: Date
}
const items = ref<Array<ChatLogItem>>()

const refresh = async () => {
    const logs = await getAllChats()
    const recent = logs.slice(0, Math.min(5, logs.length))
    recent.forEach(x => {
        loadChat(x.id)
    })

    items.value = logs.map(x => {
        let item: ChatLogItem = {
            id: x.id,
            time: new Date(x.time)
        }
        return item
    })
}
onMounted(refresh)

const isOpen = (id: string) => {
    return id === Chat.id
}

const onSelect = async (id: string) => {
    if (isOpen(id))
        return

    const open = await openChat(id)

    if (open)
        router.push("/chat")

    emit("closePanel", undefined)
}

const onConfirmDelete = () => {
    showConfirmModal.value = false
    deleteChat(delete_id!)
        .then(async () => {
            await refresh()
        })
        .finally(() => {
            delete_id = undefined
        })
}

const onCancelDelete = () => {
    showConfirmModal.value = false;
    delete_id = undefined
}

const onDeleteChat = async (id: string) => {
    delete_id = id
    showConfirmModal.value = true
}

const getLastMessage = (id: string) => {
    const log = getCache(id)
    if (log)
        return log[log.length - 1].message || ""
    return ""
}

</script>

<template>
    <ConfirmDialog v-if="showConfirmModal" :onAccept="onConfirmDelete" :onDecline="onCancelDelete">
        {{ $t(l.popup_confirm_remove_chat) }}
    </ConfirmDialog>
    <div class="restore-chat-panel">
        <div class="restore-chat-row-top">
            <h1> {{ $t(l.chat_history_title) }}</h1>
            <div class="restore-chat-button-close hide-big-screen-devices" @click="(e: Event) => $emit('closePanel', e)">
                <font-awesome-icon icon="fa-solid fa-xmark" />
            </div>
        </div>
        <div class="restore-chat-list">
            <div class="restore-chat-item" v-for="item in items" v-bind:key="item.id"
                :class="{ 'restore-chat-item-open': isOpen(item.id) }">
                <div class="restore-chat-row">
                    <div class="restore-chat-column" @click="onSelect(item.id)">
                        <div class="restore-chat-date">
                            {{ item.time.toLocaleString($i18n.locale) }}
                        </div>
                        <div class="restore-chat-text">
                            {{ getLastMessage(item.id) }}
                        </div>
                    </div>
                    <div class="restore-chat-button-delete" @click="onDeleteChat(item.id)">
                        <font-awesome-icon icon="fa-solid fa-trash" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.restore-chat-panel {
    display: flex;
    flex-direction: column;
    align-self: stretch;
    z-index: 2;
    height: 80%;
    width: 60vw;

    background-color: var(--panel-background-color);
    border-radius: 1rem;
    border: 1px solid var(--border-color);
    box-shadow: 0 0 5px var(--shadow-color);

    overflow: hidden;
    padding: 1rem 2rem;
}

.restore-chat-list {
    overflow: auto;
    padding: 1rem;
}

.restore-chat-item {
    display: flex;
    flex-direction: row;
    border-radius: 10px;
    box-shadow: 0 0 5px var(--shadow-color);
    margin: 1rem 0rem;
    background-color: var(--background-color);
    cursor: pointer;
    overflow: hidden;
    min-height: 4rem;
}

.restore-chat-item-open {
    border: 1px solid var(--accent-primary-color);
    cursor: default;
    background-color: var(--panel-background-color);
}

.restore-chat-column {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}

.restore-chat-row {
    display: flex;
    width: 100%;
    padding: 1rem;
    align-items: center;
}

.restore-chat-button-delete {
    cursor: pointer;

    * {
        width: auto;
        height: 2rem;
    }
}

.restore-chat-text {
    max-height: 2rem;
    margin-right: 1rem;
    overflow: hidden;
    font-size: small;
}

.restore-chat-date {
    margin-bottom: 0.5rem;
    font-size: large;
}

.restore-chat-button-close {
    cursor: pointer;
    position: absolute;
    right: -3rem;
}

@media screen and (max-width: 600px) {}
</style>
