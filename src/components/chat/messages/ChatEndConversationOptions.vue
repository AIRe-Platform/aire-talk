<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->

<script setup lang="ts">
import { ChatMessage } from '@/models/chat';
import { l } from '@/locales';
import useChat from '@/context/chat';
import { continueConversation } from '@/helpers/chatUtils';

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
            <button class="btn" @click="continueConversation()">{{ $t(l.conversation_option_continue) }}</button>
            <button class="btn" @click="chat.startNew()">{{ $t(l.conversation_option_new_chat) }}</button>
            <button class="btn" v-if="!chat.is_feedback_given" @click="chat.giveFeedback()"> {{
                $t(l.conversation_option_give_feedback) }}</button>
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

@media screen and (max-width: 576px) {
    .chat-end-conversation-options {
        flex-direction: column;
    }

    .chat-end-conversation-options-content {
        text-align: center;
    }

    .chat-end-conversation-options-buttons {
        flex-direction: column;
    }
}
</style>