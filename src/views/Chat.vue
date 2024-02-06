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
        <div id="chat-view" class="chat-view-content">
            <template v-for="(msg) in Chat.messages" v-bind:key="msg.id">
                <ChatBubble :message="msg" :can_revert="canRevert(msg)" />
            </template>
        </div>
    </div>
    <ChatInput v-bind:class="(UIState.isSummaryOpen) ? 'add-opacity' : 'no-opacity'" />
</template>

<style scoped>
.chat-view-wrapper {
    margin-bottom: 7rem;
}

#chat-view {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding: 1rem;
    overflow: auto;
    background-color: var(--panel-background-color);
}

.chat-view-content {
    margin: auto;
    width: 50%;
    height: 90%;
}

.chat-own-data {
    margin-left: 64rem;
}

/* mobile*/
@media screen and (max-width: 600px) {
    .chat-view-wrapper {
        margin-bottom: 4rem;
    }

    #chat-view {
        padding-left: 0rem;
        padding-top: 1rem;
    }

    .chat-view-content {
        margin: auto;
        width: 100%;
        border-radius: 10px;
        box-shadow: 0 0 5px var(--shadow-color);
        padding: 0rem;
        padding-top: 1rem;
    }
}
</style>
