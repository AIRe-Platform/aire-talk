<script setup lang="ts">
import { defineComponent } from 'vue';
import { Chat } from '@/context/chat';
import ChatBubble from '@/components/ChatBubble.vue'
import ChatInput from '@/components/ChatInput.vue'
import { UIState } from '@/context/ui';
import { ChatMessage } from '@/models/chat';
defineComponent({ name: "ChatView" })

const canRevert = (msg: ChatMessage) => {
    const lastMessageId = Chat.messages[Chat.messages.length - 1].id
    return msg.id !== lastMessageId
};
</script>

<template>
    <div class="chat-view-wrapper" v-bind:class="(UIState.isSummaryOpen) ? 'add-opacity' : 'no-opacity'">
        <div class="chat-view-content">
            <template v-for="(msg) in Chat.messages" v-bind:key="msg.id">
                <ChatBubble :message="msg" :can_revert="canRevert(msg)" />
            </template>
        </div>
        <ChatInput v-bind:class="(UIState.isSummaryOpen) ? 'add-opacity' : 'no-opacity'" />
    </div>
</template>

<style scoped>
.chat-view-wrapper {
    display: flex;
    overflow: hidden;
    flex-direction: column;
    flex-grow: 1;
    background-color: var(--panel-background-color);
}

.chat-view-content {    
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    overflow: auto;
    padding: 3.5rem 1rem;
    padding-bottom: 3.5rem;
    margin: auto;
    width: 75%;
    height: 100%;
    gap: 1.5rem;
}

/* mobile*/
@media screen and (max-width: 600px) {
    .chat-view-wrapper {
        margin-bottom: 4rem;
    }

    .chat-view-content {        
        padding-left: 0rem;
        padding-top: 1rem;
        margin: auto;
        width: 100%;
        border-radius: 10px;
        box-shadow: 0 0 5px var(--shadow-color);
        padding: 0rem;
        padding-top: 1rem;
    }
}
</style>
