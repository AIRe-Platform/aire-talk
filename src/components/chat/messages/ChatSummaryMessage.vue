<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->

<script setup lang="ts">
import { l } from '@/locales';
import { ChatMessage } from '@/models/chat';
import { defineProps } from 'vue';

const props = defineProps<{
    message: ChatMessage
}>();
</script>

<template>
    <div :id="props.message.id" class="chat-summary-message">
        <span class="chat-summary-message-title">
            {{ $t(l.summary_title) }}
        </span>
        <span class="chat-summary-message-content">
            {{ message.content }}
        </span>
    </div>
</template>

<style scoped lang="scss">
.chat-summary-message {
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

.chat-summary-message-title {
    font-size: var(--font-medium);
    font-weight: bold;
    align-self: center;
    color: var(--title-text);
}

.chat-summary-message-content {
    display: flex;
    flex-direction: column;
    font-size: var(--font-medium);
    width: 100%;
}
</style>