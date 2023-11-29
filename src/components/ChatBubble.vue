<script setup lang="ts">
import { ChatMessage } from '@/models/chat';
import { scrollToMessage } from '@/helpers/scrollToMessage'
import { defineProps, onMounted } from 'vue';
const props = defineProps<{message: ChatMessage}>()

const id = props.message.timestamp.toString()
const isSystem = props.message.role === "system";
const isBot = props.message.role === "assistant" || props.message.role === "system";

let classList: any[] = ["chat-bubble"]
switch(props.message.role)
{
    case "assistant": classList.push("chat-bubble-bot"); break;
    case "user": classList.push("chat-bubble-user"); break;
    case "system": 
        classList.push("chat-bubble-system"); 
        break;
}
if(props.message.isError)
    classList.push("chat-bubble-error");

onMounted(() => scrollToMessage(props.message));
</script>

<template>
    <div :id=id :class=classList>
        <div class="chat-bubble-content">
            <span class="chat-user-label">{{ 
                (isSystem || isBot) ? $t(message.sender) : message.sender
            }}</span>
            <span class="chat-message-text">{{
                isSystem ? $t(message.message) : message.message
            }}</span>
        </div>
    </div>
</template>

<style scoped>
.chat-bubble {
    display: block;
    padding: 0.5rem 1rem;
    margin: 1rem;
    line-height: 1.4rem;
    max-width: 42rem;
    background-color: var(--chat-bubble-background-color);
    box-shadow: 0 0 5px gray;
    border-radius: 1rem;
    border: 1px solid transparent;
}

.chat-bubble-user {
    align-self: flex-end;
    margin-left: 3rem;
}

.chat-bubble-bot {
    align-self: flex-start;
    margin-right: 3rem;
}

.chat-bubble-system {
    align-self: center;
    margin: 0 3rem;
    border-color: var(--accent-secondary-color);
}

.chat-bubble-error {
    border-color: var(--error-color);
}

.chat-bubble-content {
    display: flex;
    flex-direction: column;
}

.chat-user-label {
    font-size: x-small;
}

.chat-message-text {
    white-space: pre-line;
}
</style>