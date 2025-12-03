<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->

<script setup lang="ts">
import { l } from '@/locales';
import Modal from '@/components/common/Modal.vue';
import { onMounted, reactive, defineComponent, ref, onUnmounted } from 'vue';
import { AireReminder } from 'aire';
import { DateTime } from 'luxon';
import useChat from '@/context/chat';
import { router } from '@/router';
import { useChatCache } from '@/context/cache';
import { switchFocus } from '@/helpers/keyboarNavigation';
import { UIState } from '@/context/ui';
import { openAndContinueChat } from '@/helpers/chatUtils';
import Tooltip from "@/components/common/Tooltip.vue";
import useStatistics from '@/context/statistics';
import { ReminderEvent, ReminderEventName } from '@/models/statistics';
import useLogin from '@/context/login';
import useReminders from '@/context/reminders';

defineComponent({ name: "EventComponent" });

const state = reactive<{
    reminders: AireReminder[],
    visible: boolean
}>({
    reminders: [],
    visible: true,
});
const reminderModalRef = ref<HTMLElement | null>(null);
const statistics = useStatistics();
const login = useLogin();
const reminders = useReminders();

const checkForEvents = () => {
    reminders.getReminders(true)
        .then(res => {
            let now = DateTime.utc().toUnixInteger();
            state.reminders = res.filter(event => {
                if (event.trigger_timestamp < now && !event.read_timestamp) {
                    if (event.chat_id) {
                        useChat().load(event.chat_id); // Preload
                    }
                    return event;
                }
            });
        })
        .catch(err => {
            console.error(err);
            closeModal();
        })
        .finally(() => {
            if (state.reminders.length !== 0) {
                UIState.reminderModalRef = reminderModalRef.value;
            }
        });
}

const canContinue = (chat_id?: string) => {
    if (!chat_id)
        return false;
    return useChatCache().has(chat_id);
}

const markEventAsRead = (index: number) => {
    const reminder = state.reminders.splice(index, 1); // remove from list immediately
    if (reminder[0]) {
        statistics.sendEvent(new ReminderEvent(
            reminder[0].content?.message,
            reminder[0].trigger_timestamp,
            reminder[0].chat_id,
            login.user?.uuid,
            statistics.session?.id,
            ReminderEventName.Removed
        ));
        reminder[0].read_timestamp = DateTime.utc().toUnixInteger();
        reminders.editReminder(reminder[0])
            .catch(err => {
                console.error(err);
            })
    }
}

const returnToConversation = (reminder: AireReminder) => {
    statistics.sendEvent(new ReminderEvent(
        reminder.content?.message,
        reminder.trigger_timestamp,
        reminder.chat_id,
        login.user?.uuid,
        statistics.session?.id,
        ReminderEventName.ContinueConversation
    ));
    openAndContinueChat(reminder.chat_id!)
        .then(result => {
            if (result)
                router.push({
                    name: "Chat",
                    params: { id: reminder.chat_id }
                });
        });
}

const closeModal = () => {
    state.visible = false;
    UIState.reminderModalRef = null;
};

onMounted(async () => {
    checkForEvents();
});

onUnmounted(() => UIState.reminderModalRef = null);
</script>

<template>
    <div ref="reminderModalRef" @keydown.prevent.tab.exact="switchFocus(true, reminderModalRef)"
        @keydown.prevent.shift.tab="switchFocus(false, reminderModalRef)">
        <Modal :active="state.reminders.length > 0 && state.visible" :showCloseButton="true" @close="closeModal">
            <div class="reminders-panel">
                <div class="reminder-item" v-for="(reminder, i) in state.reminders" :key="'reminder_' + i.toString()">
                    <!-- there are warnings here TODO check this out -->
                    <div class="reminder-date">
                        {{ DateTime.fromSeconds(reminder.trigger_timestamp).toLocaleString(DateTime.DATETIME_SHORT, {
                            locale: $i18n.locale
                        }) }}
                    </div>
                    <div class="reminder-message">
                        {{ reminder.content?.message }}
                    </div>
                    <div class="reminder-buttons">
                        <Tooltip :text="$t(l.tooltip_reminder_back_to_chat)" position="bottom" :useMaxContent="false"
                            :adjustPosition="true" v-if="canContinue(reminder.chat_id)">
                            <button type="button" class="btn" @click.stop="returnToConversation(reminder)">
                                {{ $t(l.button_return_to_conversation) }}
                            </button>
                        </Tooltip>
                        <Tooltip :text="$t(l.tooltip_mark_reminder_read)" position="bottom" :useMaxContent="false"
                            :adjustPosition="true">
                            <button type="button" class="btn" @click.stop="markEventAsRead(i)">
                                {{ $t(l.button_mark_as_read) }}
                            </button>
                        </Tooltip>
                    </div>
                </div>
            </div>
        </Modal>
    </div>
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
    color: var(--basic-text);
}

.reminder-message {
    font-size: var(--font-large);
    font-family: var(--font-family);
    text-align: center;
    color: var(--basic-text);
}

.reminder-buttons {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    flex-wrap: wrap;
    gap: 1rem;
}

@media screen and ((max-aspect-ratio: 1/1) or (max-width: 920px)) {
    .reminder-item {
        min-width: unset;
    }
}
</style>