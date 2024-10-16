<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->

<script setup lang="ts">
import { defineProps } from 'vue';
import { ChatMessage } from '@/models/chat';
import { l } from '@/locales';
import useChat from '@/context/chat';

const props = defineProps<{
    message: ChatMessage
}>();

const chat = useChat();
</script>

<template>
    <div :id="props.message.id" class="chat-end-conversation-options">
        <span class="chat-end-conversation-options-content" v-if="props.message.content">
            {{ props.message.localize ? $t(props.message.content) : props.message.content }}
        </span>
        <span class="chat-end-conversation-options-buttons">
            <button @click="chat.continueConversation">{{ $t(l.conversation_option_continue) }}</button>
            <button @click="chat.startNew()">{{ $t(l.conversation_option_new_chat) }}</button>
        </span>
    </div>
</template>

<style scoped>
.chat-end-conversation-options {
    display: flex;
    line-height: 1.4rem;
    padding: 0.5rem 1rem;
    margin: 1rem 1.5rem;
    border: 2px solid var(--box-stroke);
    border-radius: 1rem;
    align-self: center;
    max-width: 80%;
    gap: 1rem;
    background-color: var(--ia-chat-box-background);
    align-items: center;
}

.chat-end-conversation-options-content {
    display: flex;
    flex-direction: column;
    font-size: var(--font-medium);
    width: 100%;
}

.chat-end-conversation-options-buttons {
    display: flex;
    flex-direction: row;
    gap: 1rem;
}
</style>