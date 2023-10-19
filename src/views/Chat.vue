<script setup lang="ts">
import { defineComponent } from 'vue';
import { chat } from '@/context/chat';
import ChatBubble from '@/components/ChatBubble.vue'
import ChatInput from '@/components/ChatInput.vue'
defineComponent({ name: "ChatView" })
console.log(chat)
</script>

<template>
    <div id="chat-view">
        <template v-for="(msg) in chat.state.history" v-bind:key="msg.timestamp">
            <ChatBubble :message="msg" />
        </template>
    </div>
    <ChatInput />
</template>

<style scoped>
#chat-view {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding: 1rem;
    overflow: auto;
}
</style>
