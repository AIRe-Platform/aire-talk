<script setup lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { Chat } from '@/context/chat';
import ChatBubble from '@/components/ChatBubble.vue'
import ChatInput from '@/components/ChatInput.vue'
import ChatSummary from '@/components/ChatSummary.vue'
import { ChatMessage } from '@/models/chat';
import QuestionWrapper from '@/components/questionnaire/QuestionWrapper.vue';
import OptionsButton from '@/components/OptionsButton.vue';
defineComponent({ name: "ChatView" })

const showSideBar = ref(false);

const canRevert = (msg: ChatMessage) => {
    const lastMessageId = Chat.messages[Chat.messages.length - 1].id
    return msg.id !== lastMessageId
};

const toggleSummary = () => {
    showSideBar.value = !showSideBar.value;
};

onMounted(() => {
    showSideBar.value = !(window.innerWidth < 600)
})
</script>

<template>
    <OptionsButton @click="toggleSummary" :open="showSideBar"/>
    <div class="chat-view">
        <div class="chat-view-content">
            <template v-for="(msg) in Chat.messages" v-bind:key="msg.id">
                <div class="fila">
                    <div class="chat-view-content-left">
                        <div class="chat-view-user" v-if="msg.role === 'user'">
                            <ChatBubble :message="msg" :can_revert="canRevert(msg)" v-if="!msg.questionItem && !msg.answer" />
                            <QuestionWrapper :message="msg" v-if="msg.questionItem || msg.answer" />
                        </div>
                        <div class="chat-view-user-gap" v-if="msg.role === 'assistant'">
                        </div>
                    </div>
                    <div class="chat-view-content-right">
                        <div class="chat-view-assistant-gap" v-if="msg.role === 'user'">
                        </div>
                        <div class="chat-view-assistant" v-if="msg.role === 'assistant'">
                            <ChatBubble :message="msg" :can_revert="canRevert(msg)" v-if="!msg.questionItem && !msg.answer" />
                            <QuestionWrapper :message="msg" v-if="msg.questionItem || msg.answer" />
                        </div>
                    </div>
                </div>
                 <div class="chat-view-system" v-if="msg.role === 'system'">
                    <ChatBubble :message="msg" :can_revert="canRevert(msg)" v-if="!msg.questionItem && !msg.answer" />
                    <QuestionWrapper :message="msg" v-if="msg.questionItem || msg.answer" />
                </div>
            </template>
        </div>
        <ChatInput />
    </div>
    <div class="chat-side-panels" :class="{ 'chat-side-panels-open': showSideBar }">
        <ChatSummary />
    </div>
</template>

<style scoped>

.fila{
    display: flex;
}
.chat-side-panels {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    flex-grow: 0;
    max-width: 16rem;
    overflow: auto;
    margin-top: 4rem;
    z-index: 2;

    width: 0;
    transition: width .25s;
}

.chat-side-panels-open {
    width: 16rem;
}

.chat-view {
    display: flex;
    overflow: hidden;
    flex-direction: column;
    flex-grow: 1;
    background-color: var(--panel-background-color);
    border-radius: 0.5rem;
}

.chat-view-content {    
    display: inline;
    flex-direction: column;
    flex-grow: 1;
    overflow-y: auto;
    overflow-x: hidden;
    height: 100%;
    padding-top: 8rem;
    padding-bottom: 4rem;
    gap: 1.5rem;
}
.chat-view-system{
    
}
.chat-view-content-left{
    display: flex;
    justify-content: flex-start;
    border-right: 2px dotted var(--border-color);
    width: 50%;
    
}

.chat-view-user{
    display: flex;
    justify-content: flex-start;
}

.chat-view-user-gap{

}

.chat-view-content-right{
    display: flex;
    justify-content: flex-end;
    align-self: flex-end;
    width: 50%;
}

.chat-view-assistant{
    display: flex;
    justify-content: flex-end;
}
.chat-view-assistant-gap{

}

@media screen and (max-width: 600px) {
    .chat-view-content {
        width: 100%;
        padding-top: 1rem;
        padding-left: 0;
        padding-right: 0;
        margin: 0;
    }

    .chat-side-panels {
        margin-top: unset;
        max-width: unset;
    }

    .chat-side-panels-open {
        width: 100%;
    }
}
</style>
