<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->


<script setup lang="ts">
import { onMounted, ref } from "vue";
import { scrollChatToBottom } from "@/helpers/scrollToMessage";
import { ChatMessage, ChatMessageGroup, ChatMessageType } from "@/models/chat";
import useChat from "@/context/chat";
import ChatItem from "@/components/chat/ChatItem.vue";
import ChatInput from "@/components/chat/ChatInput.vue";
import ChatSidePanel from "@/components/chat/ChatSidePanel.vue";
import { createReminderQuestionnaire } from "@/controllers/reminderController";
import useChatbot from "@/context/chatbot";
import useQuestionnaire from "@/context/questionnaire";
import ChatQuestionnaire from "@/components/chat/ChatQuestionnaire.vue";

const showSideBar = ref(false);
const chat = useChat();

const canRevert = (msg: ChatMessage) => {
    const lastMessageId = chat.messages[chat.messages.length - 1].id;
    return msg.id !== lastMessageId && msg.type == ChatMessageType.Default;
};

const toggleSidebar = () => {
    showSideBar.value = !showSideBar.value;
};

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
    } as ChatMessageGroup;
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
                } as ChatMessageGroup;
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
    scrollChatToBottom()

    const isNewChat = chat.messages.filter(x => x.role === "user").length === 0;
    if (isNewChat) {
        useChatbot().makeBusy();
        createReminderQuestionnaire()
            .then((reminderQuestionnaire) => {
                if (reminderQuestionnaire)
                    useQuestionnaire().startQuestionnaire(reminderQuestionnaire)
            })
            .finally(() => useChatbot().reportReady())
    }
});
</script>

<template>
    <div class="chat-view">
        <div class="chat-view-container" id="chat-viewport">
            <template v-for="(messageGroup) in groupedMessages()" v-bind:key="messageGroup.id">
                <ChatQuestionnaire v-if="messageGroup.isQuestionnaire" :group="messageGroup" />
                <template v-else v-for="msg in messageGroup.messages" v-bind:key="msg.id">
                    <div class="chat-view-row">
                        <div class="chat-view-left">
                            <ChatItem v-if="msg.role === 'user'" :message="msg" />
                        </div>
                        <div class="chat-view-right">
                            <ChatItem v-if="msg.role === 'assistant'" :message="msg" :canRevert="canRevert(msg)" />
                        </div>
                    </div>
                    <div class="chat-view-center" v-if="msg.role === 'system'">
                        <ChatItem :message="msg" />
                    </div>
                </template>
            </template>
        </div>
        <ChatInput @toggle-options="toggleSidebar" :options-open="showSideBar" :options-visible="true" />
    </div>
    <div class="chat-side-panels" :class="{ 'chat-side-panels-open': showSideBar }">
        <ChatSidePanel @close="toggleSidebar" />
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

@media screen and ((max-aspect-ratio: 1/1) or (max-width: 920px)) {
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
