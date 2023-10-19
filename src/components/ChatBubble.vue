<script setup lang="ts">
import { ChatMessage } from '@/models/chat';
import { defineProps } from 'vue';
const props = defineProps<{message: ChatMessage}>()

let classList: any[] = ["chat-bubble"]
if(props.message.sender === "bot")
    classList.push("chat-message-bot")
else
    classList.push("chat-message-user")

console.log(props.message)

</script>

<template>
    <div :class=classList>
        {{ props.message.sender }}: {{ props.message.message }}
    </div>
</template>

<style scoped>
.chat-bubble {
    display: flex;
    flex-direction: column;
    flex-grow: 0;
    justify-content: center;
    padding: 0.5rem 1rem;
    min-height: 2rem;
    box-shadow: 0 0 5px gray;
    border-radius: 1rem;
    margin: 1rem;
}

.chat-message-user {
    background-color: lightgreen;
    align-self: flex-end;
    margin-left: 3rem;
}

.chat-message-bot {
    background-color: lightcyan;
    align-self: flex-start;
    margin-right: 3rem;
}
</style>