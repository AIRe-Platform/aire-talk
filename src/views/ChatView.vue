<script setup lang="ts">
import { onMounted, ref } from "vue";
import { scrollChatToBottom } from "@/helpers/scrollToMessage";
import { l } from '@/locales';
import { ChatMessage } from "@/models/chat";
import useMobileLayout from "@/helpers/mobile";
import useChat, { ChatContext } from "@/context/chat";

import QuestionItem from "@/components/questionnaire/QuestionItem.vue";
import ChatBubble from "@/components/chat/ChatBubble.vue";
import ChatInput from "@/components/chat/ChatInput.vue";
import ChatSummary from "@/components/chat/ChatSummary.vue";
import CloseSummaryMenuButton from "@/components/chat/CloseSummaryMenuButton.vue";
import QuestionAnswer from "@/components/questionnaire/QuestionAnswer.vue";
import { setUIModeLayoutBeforeMount } from "@/context/ui";
import { createReminderQuestionnaire } from "@/controllers/reminderController";
import useChatbot from "@/context/chatbot";
import useQuestionnaire from "@/context/questionnaire";

const showSideBar = ref(false);
const chat = useChat();

const canRevert = (msg: ChatMessage) => {
    const lastMessageId = chat.messages[chat.messages.length - 1].id;
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

interface MessageGroup {
    id: string;
    messages: Array<ChatMessage>;
    isQuestionnaire: boolean;
    isCompleted?: boolean;
}

// Group chat messages to groups 
// based on similar consecutive message types (question or not)
const groupedMessages = () => {
    const result = [];
    let groupIndex = 0;
    let currentGroup = {
        id: "msg-group-" + groupIndex,
        messages: [],
        isQuestionnaire: false,
        isCompleted: false,
    } as MessageGroup;
    let previousNonHiddenIndex = 0;

    for (let i = 0; i < chat.messages.length; i++) {
        let message = chat.messages[i];
        if (!message.hidden) {
            if (!isDifferentGroup(i, previousNonHiddenIndex)) {
                currentGroup.messages.push(message);
            }
            else {
                if (currentGroup.messages.length > 0) {
                    currentGroup.isCompleted = true;
                    result.push(currentGroup);
                }
                currentGroup = {
                    id: "msg-group-" + groupIndex++,
                    messages: [],
                    isQuestionnaire: !!message.question,
                } as MessageGroup;
                currentGroup.messages.push(message);
            }
            previousNonHiddenIndex = i;
        }
    }

    if (currentGroup.messages.length > 0) {
        result.push(currentGroup);
    }

    return result;
}

const isDifferentGroup = (index: number, previousNonHiddenIndex: number) => {
    const previousWasQuestion = !!chat.messages[previousNonHiddenIndex].question;
    const currentIsQuestion = !!chat.messages[index].question;
    if (!previousWasQuestion && currentIsQuestion)
        return true;
    if (previousWasQuestion && !currentIsQuestion)
        return true;
    return false;
}

onMounted(async () => {
    showSideBar.value = !useMobileLayout.value;
    setUIModeLayoutBeforeMount();
    scrollChatToBottom()

    const isNewChat = chat.messages.filter(x => x.role === "user").length === 0;
    if (isNewChat) {
        const bot = useChatbot();

        bot.setStatus("writing")
        createReminderQuestionnaire()
            .then((reminderQuestionnaire) => {
                if (reminderQuestionnaire)
                    useQuestionnaire().startQuestionnaire(reminderQuestionnaire)
            })
            .finally(() => bot.setStatus("idle"))
    }
});
</script>

<template>
    <CloseSummaryMenuButton @toggle-menu-open="toggleSidebar" :menu-open="showSideBar"
        v-if="showSideBar && hasPanels(chat)" />
    <div class="chat-view">
        <div class="chat-view-container" id="chat-viewport">
            <template v-for="(messageGroup) in groupedMessages()" v-bind:key="messageGroup.id">
                <!-- If chat bubble -->
                <template v-if="!messageGroup.isQuestionnaire">
                    <template v-for="msg in messageGroup.messages" v-bind:key="msg.id">
                        <div class="chat-view-row">
                            <div class="chat-view-left">
                                <ChatBubble :message="msg" :can_revert="canRevert(msg)" v-if="msg.role === 'user'" />
                            </div>
                            <div class="chat-view-right">
                                <ChatBubble :message="msg" :can_revert="canRevert(msg)"
                                    v-if="msg.role === 'assistant'" />
                            </div>
                        </div>
                        <div class="chat-view-center" v-if="msg.role === 'system'">
                            <ChatBubble :message="msg" :can_revert="canRevert(msg)" />
                        </div>
                    </template>
                </template>
                <!-- If questionnaire item -->
                <template v-if="messageGroup.isQuestionnaire">
                    <div class="chat-group-questionnaire">
                        <div class="chat-questionnaire-start">
                            <h3>{{ $t(l.questionnaire_start) }}</h3>
                            <div>{{ $t(l.questionnaire_explanation) }}</div>
                        </div>
                        <template v-for="msg in messageGroup.messages" v-bind:key="msg.id">
                            <div class="chat-view-row">
                                <div class="chat-view-left">
                                </div>
                                <div class="chat-view-right">
                                    <QuestionItem :message="msg" />
                                </div>
                            </div>
                            <div class="chat-view-row">
                                <div class="chat-view-left">
                                    <QuestionAnswer :message="msg" />
                                </div>
                                <div class="chat-view-right">
                                </div>
                            </div>
                        </template>
                        <div v-if="messageGroup.isCompleted" class="chat-questionnaire-end">
                            <h3>{{ $t(l.questionnaire_end) }}</h3>
                        </div>
                    </div>
                </template>
            </template>
        </div>
        <ChatInput @toggle-options="toggleSidebar" :options-open="showSideBar" />
    </div>
    <div class="chat-side-panels" :class="{ 'chat-side-panels-open': showSideBar && hasPanels(chat) }">
        <ChatSummary v-if="chatSummaryPanelEnabled(chat)" />
    </div>
</template>

<style lang="scss" scoped>
.chat-view {
    display: flex;
    overflow: hidden;
    flex-direction: column;
    flex-grow: 1;
    border-radius: 0.5rem;
    width: 100%;
}

.chat-view-container {
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

.chat-view-row {
    display: flex;
    padding: 0.2rem 3rem;
}

.chat-view-left {
    display: flex;
    justify-content: flex-end;
    border-right: 2px dotted var(--dividers);
    width: calc(50% + 1px);
    flex-shrink: 0;
}

.chat-view-right {
    display: flex;
    justify-content: flex-start;
    align-self: flex-end;
    width: calc(50% - 3px);
    flex-shrink: 0;
}

.chat-view-center {
    display: flex;
    justify-content: space-around;
    padding-top: 1rem;
    padding-bottom: 1rem;
}

.chat-side-panels {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    flex-grow: 0;
    max-width: 16rem;
    overflow-y: auto;
    overflow-x: hidden;
    width: 0;
    transition: width 0.25s;
}

.chat-side-panels-open {
    width: 16rem;
}

.chat-group-questionnaire {
    background-color: var(--panel-background-color);
    border-radius: 1rem;
    border: 1px solid var(--panel-border-color);
    margin: 1rem;
    padding: 1rem;
}

.chat-questionnaire-start {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding-bottom: 1rem;
}

.chat-questionnaire-end {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding-top: 1rem;
}

.ui-mode-mobile {
    .chat-view-container {
        width: 100%;
        padding-top: 2.5rem;
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
        flex-direction: column;
        padding: unset;
        width: 100%;
    }

    .chat-view-left {
        justify-content: flex-start;
        border-right: none;
        width: 100%;
    }

    .chat-view-right {
        width: 100%;
        justify-content: flex-end;
        border-right: none;
    }
}
</style>
