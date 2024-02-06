<script setup lang="ts">
import { l } from '@/locales';
import { defineEmits, onMounted, ref } from 'vue';
import { DateTime } from 'luxon';
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
    time: DateTime
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
            time: DateTime.fromISO(x.time)
        }
        return item
    })
}
onMounted(refresh)

const isOpen = (id: string) => {
    console.debug("Chat IDs", Chat.id, id)
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

const onConfirmDelete = (e: Event) => {
    e.stopPropagation()
    showConfirmModal.value = false
    deleteChat(delete_id!)
        .then(async () => {
            await refresh()
        })
        .finally(() => {
            delete_id = undefined
        })
}

const onCancelDelete = (e: Event) => {
    e.stopPropagation()
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
        return log[log.length - 1].message
    return ""
}

</script>

<template>
    <ConfirmDialog v-if="showConfirmModal" :onAccept="onConfirmDelete" :onDecline="onCancelDelete">
        {{ $t(l.popup_question_remove_chat) }}
    </ConfirmDialog>
    <div class="restore-chat-panel">
        <div class="restore-chat-row-top">
            <h1> {{ $t(l.burger_menu_saved_chats) }}</h1>
            <div class="restore-chat-button-close hide-big-screen-devices" @click="(e: Event) => $emit('closePanel', e)">
                <font-awesome-icon icon="fa-solid fa-xmark" />
            </div>
        </div>
        <div class="restore-chat-content" v-for="item in items" v-bind:key="item.id">
            <div class="restore-chat-row">
                <div class="restore-chat-column" @click="onSelect(item.id)">
                    <div class="restore-chat-date">
                        {{ item.time.toFormat('hh:mm:ss - dd.MM.yyyy') }}
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
</template>

<style scoped>
.restore-chat-panel {
    background-color: var(--panel-background-color);
    position: absolute;
    margin: 2rem;
    left: 13rem;
    height: 27.5rem;
    width: 55%;
    padding: 4rem;
    border-radius: 10px;
    z-index: 2;
    overflow: scroll;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
}

.restore-chat-content {
    border-radius: 10px;
    box-shadow: 0 0 5px var(--shadow-color);
    margin: 1rem;
    padding: 1rem;
    width: 90%;
    background-color: var(--background-color);
}

.restore-chat-column {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.restore-chat-row {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
    width: 95%;
}

.restore-chat-button-delete {
    width: 2rem;
    background-color: red;
}

.restore-chat-button-close {
    position: absolute;
    right: -3rem;
}

/* mobile*/
@media screen and (max-width: 600px) {
    .restore-chat {
        margin-top: 1rem;
        left: 0.5rem;
        height: 94%;
        width: 92%;
        padding: 0.5rem;
    }

    .restore-chat-row-top {
        display: flex;
        align-items: center;
        position: fixed;
        justify-content: space-around;
        width: 94%;
        background-color: var(--panel-background-color);
        top: 1rem;
        z-index: 1;
        border-radius: 10px;
    }

    .restore-chat-content {
        position: relative;
        top: 3.5rem;
    }
}
</style>
