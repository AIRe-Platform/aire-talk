<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Chat } from "@/context/chat";
import { ChatContext, ChatMessage } from "@/models/chat";
import { scrollChatToBottom } from "@/helpers/scrollToMessage";
import QuestionItem from "@/components/questionnaire/QuestionItem.vue";
import ChatBubble from "@/components/chat/ChatBubble.vue";
import ChatInput from "@/components/chat/ChatInput.vue";
import ChatSummary from "@/components/chat/ChatSummary.vue";
import OptionsButton from "@/components/OptionsButton.vue";
import useMobileLayout from "@/helpers/mobile";
import { UIState, UISettings } from '@/context/ui';
import QuestionAnswer from "@/components/questionnaire/QuestionAnswer.vue";

const showSideBar = ref(false);

const canRevert = (msg: ChatMessage) => {
    const lastMessageId = Chat.messages[Chat.messages.length - 1].id;
    return msg.id !== lastMessageId;
};

const toggleSidebar = () => {
    showSideBar.value = !showSideBar.value;
};

const chatSummaryPanelEnabled = (chat: ChatContext) => {
    return chat.messages.length > 1;
}

const hasPanels = (chat: ChatContext) => {
    return chatSummaryPanelEnabled(chat);
}
const closeNavMenu = () => {
    UIState.showMenu = false;
    UIState.isNavMenuCompressed = false;

}
onMounted(() => {
    showSideBar.value = !useMobileLayout();
    scrollChatToBottom()
});
</script>

<template>
    <OptionsButton @click="toggleSidebar" :open="showSideBar" v-if="showSideBar && hasPanels(Chat)" />
    <div class="chat-view" :class="{ 'nav-menu-open': UIState.showMenu }" @click="closeNavMenu">
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
                        <div class="chat-view-row">
                            <div class="chat-view-content-left">
                            </div>
                            <div class="chat-view-content-right">
                                <QuestionItem :message="msg" />
                            </div>
                        </div>
                        <div class="chat-view-row">
                            <div class="chat-view-content-left">
                                <QuestionAnswer :message="msg" />
                            </div>
                            <div class="chat-view-content-right">
                            </div>
                        </div>
                    </template>
                </template>
            </template>
        </div>
        <ChatInput @toggle-options="toggleSidebar" :options-open="showSideBar" />
    </div>
    <div class="chat-side-panels"
        :class="{ 'chat-side-panels-open': showSideBar && hasPanels(Chat), 'summary-panels-open-fake-mobile-screen': showSideBar && hasPanels(Chat) && UISettings.screenSize == 'mobile-screen' }">
        <ChatSummary v-if="chatSummaryPanelEnabled(Chat)" />
    </div>
</template>

<style scoped>
.chat-view-row {
    display: flex;
    padding: 0rem 3rem;
}

.nav-menu-open {
    filter: blur(2px);
}

.chat-side-panels {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    flex-grow: 0;
    max-width: 16rem;
    overflow-y: auto;
    overflow-x: hidden;
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
    z-index: 1;
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
    border-right: 2px dotted var(--dividers);
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

.summary-panels-open-fake-mobile-screen {
    width: 100%;
    max-width: 26rem;
}

@media screen and ((max-aspect-ratio: 1/1) or (max-width: 920px)) {
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
        display: flex;
        padding: unset;
    }

    .chat-view-content-left {
        justify-content: flex-start;
        border-right: none;
    }

    .chat-view-content-right {
        width: unset;
        justify-content: flex-end;
        border-right: none;

    }
}
</style>
