<script setup lang="ts">
import { ChatMessage } from '@/models/chat';
import { defineProps, onMounted } from 'vue';
import { scrollToMessage } from '@/helpers/scrollToMessage'
const props = defineProps<{message: ChatMessage}>()

let classList: any[] = ["chat-bubble"]
if(props.message.is_user)
    classList.push("chat-bubble-user")
else
    classList.push("chat-bubble-bot")

console.log(props.message)

onMounted(() => {
    scrollToMessage(props.message)
})

</script>

<template>
    <div :id=props.message.timestamp.toString() :class=classList>
        <div class="chat-bubble-content">
            <span class="chat-user-label">{{ props.message.sender_name }}</span>
            <span class="chat-message-text">{{ props.message.message }}</span>
        </div>
    </div>
</template>

<style scoped>
.chat-bubble {
    display: block;
    padding: 0.5rem 1rem;
    box-shadow: 0 0 5px gray;
    border-radius: 1rem;
    margin: 1rem;
    line-height: 1.4rem;
    max-width: 42rem;
}

.chat-bubble-user {
    background-color: rgb(255, 255, 255);
    align-self: flex-end;
    margin-left: 3rem;
}

.chat-bubble-bot {
    background-color: rgb(255, 255, 255);
    align-self: flex-start;
    margin-right: 3rem;
}

.chat-bubble-content {
    display: flex;
    flex-direction: column;
}

.chat-user-label {
    font-size: x-small;
    color: rgb(150, 150, 150);
}
</style>