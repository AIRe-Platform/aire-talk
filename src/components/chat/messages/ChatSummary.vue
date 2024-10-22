<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->

<script setup lang="ts">
import useChat from '@/context/chat';
import { getLastMessage, listChatKeywords } from '@/helpers/chatUtils';
import { l } from '@/locales';
import { ChatMessage } from '@/models/chat';
import { computed, defineProps } from 'vue';

const props = defineProps<{
    message: ChatMessage
}>();

const chat = useChat();

const removeKeyword = (keyword: string) => {
    chat.removeKeyword(keyword, true);
};

const getKeywords = (messages: ChatMessage[], until_message_id: string) => {
    const i = messages.findIndex(x => x.id === until_message_id);
    return listChatKeywords(messages.slice(0, i));
};

const keywords = computed(() => getKeywords(chat.messages, props.message.id));

const isLastMessage = computed(() => getLastMessage()?.id == props.message.id);
</script>

<template>
    <div :id="props.message.id" class="chat-summary">
        <span class="chat-summary-title">
            {{ $t(l.summary_title) }}
        </span>
        <span class="chat-summary-content" v-if="props.message.content">
            {{ props.message.localize ? $t(props.message.content) : props.message.content }}
        </span>
        <div class="chat-summary-keywords" v-if="keywords && keywords.length > 0">
            <div class="chat-summary-keyword" v-for="keyword, i in keywords"
                :key="'keyword_' + props.message.id + '_' + i">
                <span class="chat-summary-keyword-label">{{ keyword }}</span>
                <div class="chat-summary-keyword-delete tooltip" @click="removeKeyword(keyword)" v-if="isLastMessage">
                    <font-awesome-icon icon="fa-solid fa-xmark" />
                    <span class="tooltiptext">{{ $t(l.tooltip_remove_keyword) }}</span>
                </div>
            </div>
        </div>
        <div class="chat-summary-options" v-if="isLastMessage">
            <span class="chat-summary-title">
                {{ $t(l.summary_acceptation_question) }}
            </span>
            <span class="chat-summary-options-buttons">
                <button @click="chat.onAcceptSummary" class="tooltip">
                    {{ $t(l.button_yes) }}
                    <span class="tooltiptext">{{ $t(l.tooltip_accept_summary) }}</span>
                </button>
                <button @click="chat.onRejectSummary" class="tooltip">
                    {{ $t(l.button_no) }}
                    <span class="tooltiptext">{{ $t(l.tooltip_reject_summary) }}</span>
                </button>
            </span>
        </div>
    </div>
</template>

<style scoped lang="scss">
.separator {
    padding: 1rem 0rem;
}

.chat-summary-options {
    display: flex;
    flex-direction: column;
    align-self: center;
}

.chat-summary {
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

.chat-summary-title {
    font-size: var(--font-medium);
    font-weight: bold;
    align-self: center;
    color: var(--title-text);
    padding: 1rem 0rem;
}

.chat-summary-content,
.chat-summary-options-content {
    display: flex;
    flex-direction: column;
}

.chat-summary-keyword {
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

.chat-summary-keyword-label {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--summary-keyword-item-font-color);
    margin-right: 1rem;
    margin-left: 1rem;
}

.chat-summary-keywords {
    display: flex;
    justify-content: center;
    gap: 2rem;
    padding: 1rem
}

.chat-summary-keyword-delete {
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

.chat-summary-options-buttons {
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: 1rem;
}
</style>