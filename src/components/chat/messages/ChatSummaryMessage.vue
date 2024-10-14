<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->

<script setup lang="ts">
import useChat from '@/context/chat';
import { listChatKeywords } from '@/helpers/chatUtils';
import { l } from '@/locales';
import { ChatMessage, ChatMessageType } from '@/models/chat';
import { defineProps, onMounted, reactive } from 'vue';
import Separator from "@/components/common/Separator.vue";
import { createControlFlowMessage } from '@/helpers/chatMessages';

const state = reactive<{
    currentKeywords: string[],
    isNewSummary: boolean
}>({
    currentKeywords: [],
    isNewSummary: true
});

const props = defineProps<{
    message: ChatMessage,
    isNewSummary: boolean
}>();
const chat = useChat();


const removeThisKeyword = (keyword: string) => {

    chat.removeKeyword(keyword, true);

    const i = state.currentKeywords
        .findIndex(x => x == keyword);

    if (i > -1) {
        if (state.currentKeywords.length < i + 1) {
            // Check if the next message is an instruction
            if (state.currentKeywords[i + 1] == ChatMessageType.Instruction) {
                state.currentKeywords.splice(i + 1, 1);
            }
        }
        state.currentKeywords.splice(i, 1);
    }
};

const resetSummary = () => {
    console.log("reject summary");

    /*     if (findLatestSummary(chat.messages) != undefined) {
            //removing the summary message rejected by the user
            const summaryToDeleteMessageId = chat.messages.findLast(x => x.type == ChatMessageType.Summary)?.id;
            const index = chat.messages.findIndex(x => x.id === summaryToDeleteMessageId);
            chat.messages = chat.messages.slice(0, index);
    
            //get the lastest summary message after that
            const summaryMessageId = chat.messages.findLast(x => x.type == ChatMessageType.Summary)?.id;
    
            if (summaryMessageId) {
                chat.revertTo(summaryMessageId);
                chat.continueConversation();
            } else {
                //reset to the beginning not new chat
                chat.messages = chat.messages.slice(0, 1);
            }
        } 
            state.isNewSummary = false;*/


};

const acceptSummary = async () => {

    await chat.suggestContent(listChatKeywords(chat.messages));
    const end = createControlFlowMessage(ChatMessageType.EndOfConversation, l.system_end_of_conversation);
    chat.messages.push(end);
    const options = createControlFlowMessage(ChatMessageType.EndOfConversationOptions, l.system_end_of_conversation_options);
    chat.messages.push(options);
    state.isNewSummary = false;
};

onMounted(async () => {
    state.currentKeywords = listChatKeywords(chat.messages);
    state.currentKeywords.push("anotherone", "bites", "dust");
    state.isNewSummary = props.isNewSummary;
})
</script>

<template>
    <div :id="props.message.id" class="chat-summary-message">
        <span class="chat-summary-message-title">
            {{ $t(l.summary_title) }}
        </span>

        <span class="chat-conversation-options-content" v-if="props.message.content">
            {{ props.message.localize ? $t(props.message.content) : props.message.content }}
        </span>
        <Separator class="separator" />

        <span class="chat-summary-message-title">
            Themes
        </span>
        <div class="chat-conversation-keyword-content" v-if="state.currentKeywords">
            <div class="keyword-item" v-for="keyword in state.currentKeywords">
                <span class="keyword-text">{{ keyword }}</span>
                <div class="summary-keyword-delete" @click="removeThisKeyword(keyword)">
                    <font-awesome-icon icon="fa-solid fa-xmark" />
                </div>
            </div>
        </div>

        <span class="chat-summary-message-content">
            {{ $t(l.system_summary_instructions) }}
        </span>
        <div class="message-options" v-if="state.isNewSummary">
            <Separator class="separator" />
            <span class="chat-summary-message-title">
                Do you accept this summary?
            </span>
            <span class="chat-conversation-options-buttons">
                <button @click="acceptSummary">{{ $t(l.button_accept) }}</button>
                <button @click="resetSummary">{{ $t(l.button_cancel) }}</button>
            </span>
        </div>
    </div>
</template>

<style scoped lang="scss">
.separator {
    padding: 1rem 0rem;
}

.message-options {
    display: flex;
    flex-direction: column;
    align-self: center;
}

.chat-summary-message {
    display: flex;
    flex-direction: column;
    line-height: 1.4rem;
    padding: 0.5rem 1rem;
    margin: 1rem 1.5rem;
    border: 2px solid var(--box-stroke);
    border-radius: 1rem;
    align-self: center;
    max-width: 80%;
    background-color: var(--ia-chat-box-background);
}

.chat-summary-message-title {
    font-size: var(--font-medium);
    font-weight: bold;
    align-self: center;
    color: var(--title-text);
    padding: 1rem 0rem;
}

.chat-summary-message-content,
.chat-conversation-options-content {
    display: flex;
    flex-direction: column;
    padding: 2rem 10rem;
}

.keyword-item {
    display: flex;
    flex-direction: row;
    font-size: var(--font-small);
    justify-content: center;
    align-items: stretch;
    height: 2rem;
    border-radius: 1rem;
    border: 2px solid var(--border-color);
    background-color: var(--summary-keyword-item-background);
}

.keyword-text {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--summary-keyword-item-font-color);
    margin-right: 1rem;
    margin-left: 1rem;
}

.chat-conversation-keyword-content {
    display: flex;
    justify-content: center;
    gap: 2rem;
    padding: 1rem
}

.summary-keyword-delete {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    width: 2rem;
    transition: color .2s;
    color: #B6465F;
    font-size: large;

    &:hover {
        color: var(--accent-secondary-color);
    }
}

.chat-conversation-options-buttons {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 1rem;
}
</style>