<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->

<script setup lang="ts">
import { defineProps } from 'vue';
import { ChatMessage } from '@/models/chat';
import ChatItemOptions from '@/components/chat/ChatItemOptions.vue';

const props = defineProps<{
    message: ChatMessage;
    canRevert?: boolean;
}>();
</script>

<template>
    <div :id="props.message.id" :class="{
        'chat-bubble': true,
        'chat-bubble-user': props.message.role === 'user',
        'chat-bubble-assistant': props.message.role === 'assistant',
        'chat-bubble-system': props.message.role === 'system'
    }">
        <ChatItemOptions :parent="props.message" :can_revert="props.canRevert"
            v-if="props.message.role === 'assistant'" />
        <div class="chat-bubble-content">
            <span class="chat-bubble-user-label" v-if="props.message.role !== 'system'">
                {{ (props.message.role === 'assistant') ? $t(message.sender) : message.sender }}
            </span>
            <span class="chat-bubble-text">
                {{ message.content }}
            </span>
        </div>
    </div>
</template>

<style scoped lang="scss">
.chat-bubble {
    display: block;
    line-height: 1.4rem;
    padding: 0.5rem 1rem;
    margin: 1rem 1.5rem;
    border: 2px solid var(--box-stroke);
    border-radius: 1rem;
    max-width: calc(100% - 2rem - 3rem - 4px); // Removed padding, margin, border
}

.chat-bubble-user {
    align-self: flex-start;
    background-color: var(--user-chat-box-background);
    width: 100%;
}

.chat-bubble-assistant {
    align-self: flex-end;
    height: fit-content;
    width: 100%;
    background-color: var(--ia-chat-box-background);
}

.chat-bubble-system {
    align-self: center;
    max-width: 80%;
    margin-left: 3rem;
    background-color: var(--ia-chat-box-background);
}

.chat-bubble-content {
    display: flex;
    flex-direction: column;
    font-size: var(--font-medium);
    width: 100%;
}

.chat-bubble-user-label {
    font-size: var(--font-medium);
    font-weight: bold;
}

.chat-bubble-assistant .chat-bubble-user-label {
    color: var(--chat-bubble-bot-label);
}

.chat-bubble-user .chat-bubble-user-label {
    color: var(--chat-user-label);
}

.chat-bubble-user .chat-bubble-content {
    align-items: flex-end;
}

.chat-bubble-text {
    white-space: pre-line;
}

@media screen and ((max-aspect-ratio: 1/1) or (max-width: 920px)) {
    .chat-bubble {
        margin: 0.5rem 1rem 0.5rem 0.3rem
    }
}
</style>