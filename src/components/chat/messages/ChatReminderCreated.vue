<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->

<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue';
import { ChatMessage } from '@/models/chat';
import { DateTime } from 'luxon';
import { l } from '@/locales';
import useReminders from '@/context/reminders';

const props = defineProps<{
    message: ChatMessage
}>();

const state = reactive<{
    busy: boolean,
    cancelled: boolean
}>({
    busy: true,
    cancelled: false
});

const reminders = useReminders();

const cancelReminder = () => {
    if (!props.message.reminder?.id || state.cancelled)
        return;
    state.busy = true; // Leave busy
    reminders.deleteReminder(props.message.reminder.id)
        .then(() => state.cancelled = true);
}

const showCancelButton = computed(() =>
    props.message.reminder?.id && !state.busy && !state.cancelled);

const fetchReminder = () => {
    if (!props.message.reminder?.id)
        return;
    state.busy = true;
    reminders.getReminder(props.message.reminder.id)
        .then(res => {
            state.cancelled = (res === undefined);
        })
        .finally(() => state.busy = false)
}

onMounted(fetchReminder);
</script>

<template>
    <div :id="props.message.id" class="chat-reminder-created" v-if="props.message.reminder">
        <span class="chat-reminder-content" :class="{
            'chat-reminder-cancelled': state.cancelled
        }">
            {{
                $t(l.system_reminder_set,
                    {
                        time: DateTime
                            .fromSeconds(props.message.reminder.trigger_timestamp)
                            .toLocaleString(DateTime.DATETIME_SHORT, { locale: $i18n.locale }),
                        subject: props.message.reminder.content?.message
                    })
            }}
        </span>
        <span class="chat-reminder-buttons">
            <button class="chat-reminder-button" v-if="showCancelButton" @click="cancelReminder">
                {{ $t(l.button_cancel) }}
            </button>
        </span>
    </div>
</template>

<style lang="scss" scoped>
.chat-reminder-created {
    display: flex;
    flex-direction: column;
    line-height: 1.4rem;
    padding: 0.5rem 1rem;
    margin: 1rem 1.5rem;
    border: 2px solid var(--box-stroke);
    border-radius: 1rem;
    align-self: center;
    max-width: 80%;
    background-color: var(--ia-chat-box-background);
}

.chat-reminder-cancelled {
    text-decoration: line-through;
}

.chat-reminder-content {
    display: flex;
    flex-direction: column;
    font-size: var(--font-medium);
    width: 100%;
}

.chat-reminder-buttons {
    display: flex;
    flex-direction: row;
    align-self: center;
    align-items: center;
    justify-content: center;
    gap: 1rem;
}

.chat-reminder-button {
    font-style: italic;
    color: inherit;
    font-family: inherit;
    font-size: inherit;
    cursor: pointer;
    margin-top: 0.5rem;
    border: none;
    background-color: transparent;

    &:hover {
        color: var(--button-color);
    }
}
</style>