<script setup lang="ts">
import { defineComponent } from 'vue';
import { Chat } from '@/context/chat';
import ChatBubble from '@/components/ChatBubble.vue'
import ChatInput from '@/components/ChatInput.vue'
import { l } from '@/locales';

defineComponent({ name: "ChatView" })
</script>

<template>

    <div class="chat-own-data">
        {{ $t(l.chat_data) }} 
        <!-- v-if="{{ Chat?.landingInfo.age != null }}" -->
        <div >
            {{ $t(l.chat_age) }} {{ Chat.landingInfo.age }}

            {{ $t(l.chat_occupation) }}  {{ Chat.landingInfo.occupation }}
        </div>
    </div>
    <div id="chat-view">
        <template v-for="(msg) in Chat.history" v-bind:key="msg.timestamp">
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
    background-color: var(--panel-background-color);
}
</style>
