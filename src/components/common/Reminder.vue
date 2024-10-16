<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->

<script setup lang="ts">
import { l } from '@/locales';
import Modal from '@/components/common/Modal.vue';
import { onMounted, reactive, defineComponent } from 'vue';
import { AireReminder, AireServices, AireStatus } from 'aire';
import Separator from './Separator.vue';
import { DateTime } from 'luxon';

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
                        if (event.trigger_timestamp < now && !event.read_timestamp)
                            return event;
                    })
                }
            })
            .catch(err => {
                console.error(err);
            })
    }
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

const closeModal = () => { state.visible = false; }

onMounted(async () => {
    checkForEvents();
})
</script>

<template>
    <Modal :active="state.reminders.length > 0 && state.visible" :showCloseButton="true" @close="closeModal">
        <div class="reminders-panel" v-for="(reminder, i) in state.reminders" :key="'reminder_' + i.toString()">
            <Separator />
            <div class="reminder-date">
                {{ DateTime.fromSeconds(reminder.trigger_timestamp).toLocaleString(DateTime.DATETIME_SHORT) }}
            </div>
            <div class="reminder-message">
                {{ reminder.content?.message }}
            </div>
            <div class="reminder-buttons">
                <button @click.stop="markEventAsRead(i)">
                    {{ $t(l.button_mark_as_read) }}
                </button>
            </div>
        </div>
    </Modal>
</template>

<style lang="scss" scoped>
.reminders-panel {
    padding-top: 2em;
}

.reminder-date {
    font-size: var(--font-small);
    font-family: var(--font-family);
    text-align: center;
    padding-bottom: 1rem;
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
    margin-top: 1rem;
}
</style>