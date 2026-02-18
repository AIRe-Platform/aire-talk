<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->

<script setup lang="ts">
import { getLastMessage, listChatKeywords, onAcceptSummary, onRejectSummary, removeKeyword } from '@/helpers/chatUtils';
import { getUILanguage, l } from '@/locales';
import { ChatMessage } from '@/models/chat';
import { computed } from 'vue';
import Tooltip from "@/components/common/Tooltip.vue";
import useKeywords from '@/context/keywords';

const props = defineProps<{
    message: ChatMessage
}>();

const contentKeyword = computed(() => {
    const lang = getUILanguage();
    return keywords.value.map(keyword => {
        // Get translation for each keyword
        const translation = useKeywords().getTranslation(keyword, lang.value);
        return translation !== undefined ? translation : keyword;
    });
});

const keywords = computed(() => listChatKeywords());
const isLastMessage = computed(() => getLastMessage()?.id == props.message.id);
</script>

<template>
    <div :id="props.message.id" class="chat-summary">
        <h2 class="chat-summary-title">
            {{ $t(l.summary_title) }}
        </h2>
        <span class="chat-summary-content" v-if="props.message.content">
            {{ props.message.localize ? $t(props.message.content) : props.message.content }}
        </span>
        <div class="chat-summary-keywords" v-if="keywords && keywords.length > 0">
            <div class="chat-summary-keyword" v-for="(keyword, i) in contentKeyword"
                :key="'keyword_' + props.message.id + '_' + i">
                <span class="chat-summary-keyword-label">{{ keyword }}</span>
                <Tooltip :text="$t(l.tooltip_remove_keyword)" position="top" :useMaxContent="true"
                    :adjustPosition="true">
                    <button class="chat-summary-keyword-delete" type="button"
                        :aria-label="$t(l.tooltip_remove_keyword)"
                        @click="removeKeyword(keywords[i], true)">
                        <font-awesome-icon icon="fa-solid fa-xmark" />
                    </button>
                </Tooltip>
            </div>
        </div>
        <div class="chat-summary-options" v-if="isLastMessage">
            <h3 class="chat-summary-title">
                {{ $t(l.summary_acceptation_question) }}
            </h3>
            <span class="chat-summary-options-buttons">
                <Tooltip :text="$t(l.tooltip_accept_summary)" position="top" :useMaxContent="true"
                    :adjustPosition="true">
                    <button @click="onAcceptSummary" class="btn button-accept">
                        {{ $t(l.button_yes) }}
                    </button>
                </Tooltip>
                <Tooltip :text="$t(l.tooltip_reject_summary)" position="top" :useMaxContent="true"
                    :adjustPosition="true">
                    <button @click="onRejectSummary" class="btn button-accept">
                        {{ $t(l.button_no) }}
                    </button>
                </Tooltip>
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
    margin-block-end: 0;
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
    border: none;
    background-color: transparent;
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