<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->


<script setup lang="ts">
import { defineProps } from 'vue';
import { ChatMessage } from '@/models/chat';
import { DateTime } from 'luxon';
import { l } from '@/locales';

const props = defineProps<{
    message: ChatMessage
}>();
</script>

<template>
    <div :id="props.message.id" class="chat-reminder-created" v-if="props.message.reminder">
        <span class="chat-reminder-content">
            {{
                $t(l.system_reminder_set,
                    {
                        time: DateTime
                            .fromSeconds(props.message.reminder.trigger_timestamp)
                            .toLocaleString(DateTime.DATETIME_SHORT),
                        subject: props.message.reminder.content?.message
                    })
            }}
        </span>
    </div>
</template>

<style scoped>
.chat-reminder-created {
    display: block;
    line-height: 1.4rem;
    padding: 0.5rem 1rem;
    margin: 1rem 1.5rem;
    border: 2px solid var(--box-stroke);
    border-radius: 1rem;
    align-self: center;
    max-width: 80%;
    background-color: var(--ia-chat-box-background);
}

.chat-reminder-content {
    display: flex;
    flex-direction: column;
    font-size: var(--font-medium);
    width: 100%;
}
</style>