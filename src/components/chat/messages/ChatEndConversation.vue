<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->

<script setup lang="ts">
import { ChatMessage } from '@/models/chat';

const props = defineProps<{
    message: ChatMessage
}>();
</script>

<template>
    <div :id="props.message.id" class="chat-end-conversation" v-if="props.message.content">
        <h2 class="chat-end-conversation-content">
            {{ props.message.localize ? $t(props.message.content) : props.message.content }}
        </h2>
    </div>
</template>

<style scoped>
.chat-end-conversation {
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

.chat-end-conversation-content {
    display: flex;
    flex-direction: column;
    font-size: var(--font-medium);
    color: var(--title-text);
    width: 100%;
    margin-block-end: 0;
}
</style>