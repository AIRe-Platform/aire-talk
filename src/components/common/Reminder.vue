<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->

<script setup lang="ts">
import { l } from '@/locales';
import Modal from '@/components/common/Modal.vue';
import { onMounted, reactive, defineComponent } from 'vue';
import { AireReminder, AireServices, AireStatus } from 'aire';
import { DateTime } from 'luxon';
import useChat from '@/context/chat';
import { router } from '@/router';
import { useChatCache } from '@/context/cache';

defineComponent({ name: "EventComponent" })

const state = reactive<{
    reminders: AireReminder[],
    visible: boolean
}>({
    reminders: [],
    visible: true,
});

const checkForEvents = () => {
    if (AireServices.Memory) {
        AireServices.Memory.getReminders(true)
            .then(res => {
                let now = DateTime.utc().toUnixInteger();
                if (res.status === AireStatus.Success && res.data) {
                    state.reminders = res.data.filter(event => {
                        if (event.trigger_timestamp < now && !event.read_timestamp) {
                            if (event.chat_id) {
                                useChat().load(event.chat_id); // Preload
                            }
                            return event;
                        }
                    })
                }
            })
            .catch(err => {
                console.error(err);
            })
    }
}

const canContinue = (chat_id?: string) => {
    if(!chat_id)
        return false;
    return useChatCache().has(chat_id);
}

const markEventAsRead = (index: number) => {
    const reminder = state.reminders.splice(index, 1); // remove from list immediately
    if (AireServices.Memory && reminder[0]) {
        reminder[0].read_timestamp = DateTime.utc().toUnixInteger();
        AireServices.Memory.editReminder(reminder[0])
            .catch(err => {
                console.error(err);
            })
    }
}

const returnToConversation = (id: string) => {
    useChat().onContinueConversation(id)
        .then(result => {
            if (result)
                router.push("/chat");
        });
}

const closeModal = () => { state.visible = false; }

onMounted(async () => {
    checkForEvents();
})
</script>

<template>
    <Modal :active="state.reminders.length > 0 && state.visible" :showCloseButton="true" @close="closeModal">
        <div class="reminders-panel">
            <div class="reminder-item" v-for="(reminder, i) in state.reminders" :key="'reminder_' + i.toString()">
                <div class="reminder-date">
                    {{ DateTime.fromSeconds(reminder.trigger_timestamp).toLocaleString(DateTime.DATETIME_SHORT) }}
                </div>
                <div class="reminder-message">
                    {{ reminder.content?.message }}
                </div>
                <div class="reminder-buttons">
                    <button @click.stop="returnToConversation(reminder.chat_id!)" v-if="canContinue(reminder.chat_id)">
                        {{ $t(l.button_return_to_conversation) }}
                    </button>
                    <button @click.stop="markEventAsRead(i)">
                        {{ $t(l.button_mark_as_read) }}
                    </button>
                </div>
            </div>
        </div>
    </Modal>
</template>

<style lang="scss" scoped>
.reminders-panel {
    display: flex;
    flex-direction: column;
    margin: 1.5rem;
    gap: 1rem;
}

.reminder-item {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    border-top: 1px solid var(--border-color);
    min-width: 320px;
}

.reminder-date {
    padding-top: 1rem;
    font-size: var(--font-medium);
    font-family: var(--font-family);
    text-align: center;
}

.reminder-message {
    font-size: var(--font-large);
    font-family: var(--font-family);
    text-align: center;
}

.reminder-buttons {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    flex-wrap: wrap;
}

@media screen and ((max-aspect-ratio: 1/1) or (max-width: 920px)) {
    .reminder-item {
        min-width: unset;
    }
}
</style>