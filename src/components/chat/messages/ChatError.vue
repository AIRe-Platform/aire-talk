<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->


<script setup lang="ts">
import { defineProps } from 'vue';
import { l } from '@/locales';
import { ChatMessage } from '@/models/chat';

const props = defineProps<{
    message: ChatMessage
}>();
</script>

<template>
    <div :id="props.message.id" class="chat-error" v-if="props.message.content">
        <div class="chat-error-title">
            {{  $t(l.aire_system) }}
        </div>
        <div class="chat-error-content">
            {{  props.message.localize ?  $t(props.message.content) : props.message.content }}
        </div>
    </div>
</template>

<style scoped lang="scss">
.chat-error {
    display: block;
    line-height: 1.4rem;
    padding: 0.5rem 1rem;
    margin: 1rem 1.5rem;
    border: 2px solid var(--error-color);
    background-color: var(--ia-chat-box-background);
    color: var(--error-color);
    border-radius: 1rem;
    align-self: center;
    max-width: 80%;
}

.chat-error-title {
    font-size: var(--font-medium);
    font-weight: bold;
    align-self: center;
}

.chat-error-content {
    display: flex;
    flex-direction: column;
    font-size: var(--font-medium);
    width: 100%;
}
</style>