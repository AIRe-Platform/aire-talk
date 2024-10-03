<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->

<script setup lang="ts">
import { defineProps } from 'vue';
import { ChatMessage } from '@/models/chat';
import ChatItemOptions from '../ChatItemOptions.vue';

const props = defineProps<{
    message: ChatMessage;
    canRevert?: boolean;
}>();
</script>

<template>
    <div :id="props.message.id" :class="{
        'chat-message': true,
        'chat-message-user': props.message.role === 'user',
        'chat-message-assistant': props.message.role === 'assistant',
        'chat-message-system': props.message.role === 'system'
    }">
        <ChatItemOptions :parent="props.message" :can_revert="props.canRevert"
            v-if="props.message.role === 'assistant'" />
        <div class="chat-message-content">
            <span class="chat-message-user-label" v-if="props.message.role !== 'system'">
                {{ (props.message.role === 'assistant') ? $t(message.sender) : message.sender }}
            </span>
            <span class="chat-message-text">
                {{ message.content }}
            </span>
        </div>
    </div>
</template>

<style scoped lang="scss">
.chat-message {
    display: block;
    line-height: 1.4rem;
    padding: 0.5rem 1rem;
    margin: 1rem 1.5rem;
    border: 2px solid var(--box-stroke);
    border-radius: 1rem;
    max-width: calc(100% - 2rem - 3rem - 4px); // Removed padding, margin, border
}

.chat-message-user {
    align-self: flex-start;
    background-color: var(--user-chat-box-background);
    width: 100%;
}

.chat-message-assistant {
    align-self: flex-end;
    height: fit-content;
    width: 100%;
    background-color: var(--ia-chat-box-background);
}

.chat-message-system {
    align-self: center;
    max-width: 80%;
    margin-left: 3rem;
    background-color: var(--ia-chat-box-background);
}

.chat-message-content {
    display: flex;
    flex-direction: column;
    font-size: var(--font-medium);
    width: 100%;
}

.chat-message-user-label {
    font-size: var(--font-medium);
    font-weight: bold;
}

.chat-message-assistant .chat-message-user-label {
    color: var(--chat-bubble-bot-label);
}

.chat-message-user .chat-message-user-label {
    color: var(--chat-user-label);
}

.chat-message-user .chat-message-content {
    align-items: flex-end;
}

.chat-message-text {
    white-space: pre-line;
}

.chat-content-panel {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: space-around;
    gap: 1rem;
    padding: 1rem;
    margin: 0;
    margin-top: 1rem;
}

@media screen and ((max-aspect-ratio: 1/1) or (max-width: 920px)) {
    .chat-bubble {
        margin: 0.5rem 1rem 0.5rem 0.3rem
    }
}
</style>