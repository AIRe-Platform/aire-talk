<script setup lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { Chat } from "@/context/chat";
import { ChatMessage } from "@/models/chat";
import { scrollChatToBottom } from "@/helpers/scrollToMessage";
import OptionsButton from "@/components/OptionsButton.vue";
import QuestionItem from "@/components/questionnaire/QuestionItem.vue";
import ChatBubble from "@/components/chat/ChatBubble.vue";
import ChatInput from "@/components/chat/ChatInput.vue";
import ChatSummary from "@/components/chat/ChatSummary.vue";
defineComponent({ name: "ChatView" });

const showSideBar = ref(false);

const canRevert = (msg: ChatMessage) => {
    const lastMessageId = Chat.messages[Chat.messages.length - 1].id;
    return msg.id !== lastMessageId;
};

const toggleSummary = () => {
    showSideBar.value = !showSideBar.value;
};

onMounted(() => {
    showSideBar.value = !(window.innerWidth < 600);
    scrollChatToBottom()
});
</script>

<template>
    <OptionsButton @click="toggleSummary" :open="showSideBar" />
    <div class="chat-view">
        <div class="chat-view-content" id="chat-viewport">
            <template v-for="msg in Chat.messages" v-bind:key="msg.id">
                <template v-if="!msg.hidden">
                    <!-- If chat bubble -->
                    <template v-if="msg.question === undefined">
                        <div class="chat-view-row">
                            <div class="chat-view-content-left">
                                <div class="chat-view-user" v-if="msg.role === 'user'">
                                    <ChatBubble :message="msg" :can_revert="canRevert(msg)" />
                                </div>
                            </div>
                            <div class="chat-view-content-right">
                                <div class="chat-view-assistant" v-if="msg.role === 'assistant'">
                                    <ChatBubble :message="msg" :can_revert="canRevert(msg)" />
                                </div>
                            </div>
                        </div>
                        <div class="chat-view-system" v-if="msg.role === 'system'">
                            <ChatBubble :message="msg" :can_revert="canRevert(msg)" />
                        </div>
                    </template>
                    <!-- If questionnaire item -->
                    <template v-if="msg.question">
                        <QuestionItem :message="msg" />
                    </template>
                </template>
            </template>
        </div>
        <ChatInput />
    </div>
    <div class="chat-side-panels" :class="{ 'chat-side-panels-open': showSideBar }">
        <ChatSummary />
    </div>
</template>

<style scoped>
.chat-view-row {
    display: flex;
    padding: 0rem 3rem;
}

.chat-side-panels {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    flex-grow: 0;
    max-width: 16rem;
    overflow-y: auto;
    overflow-x: hidden;
    margin-top: 4rem;
    z-index: 2;

    width: 0;
    transition: width 0.25s;
}

.chat-side-panels-open {
    width: 16rem;
}

.chat-view {
    display: flex;
    overflow: hidden;
    flex-direction: column;
    flex-grow: 1;
    background-color: var(--background-color);
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

.chat-view-system {
    padding-top: 1rem;
    padding-bottom: 1rem;
    display: flex;
    justify-content: space-around;
}

.chat-view-content-left {
    display: flex;
    justify-content: flex-end;
    border-right: 2px dotted var(--border-color);
    width: 50%;
}

.chat-view-user {
    display: flex;
    justify-content: flex-end;
}

.chat-view-content-right {
    display: flex;
    justify-content: flex-start;
    align-self: flex-end;
    width: 50%;
}

.chat-view-assistant {
    display: flex;
    justify-content: flex-start;
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

    .chat-view-row {
        display: block;
        padding: unset;
    }

    .chat-view-content-left {
        justify-content: flex-start;
        width: unset;
        border-right: none;
    }

    .chat-view-content-right {
        width: unset;
        justify-content: flex-end;
        border-right: none;
    }
}
</style>
