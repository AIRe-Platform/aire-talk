<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->

<script setup lang="ts">
import { l } from '@/locales';
import { ChatMessageGroup } from '@/models/chat';
import { defineProps } from 'vue';
import QuestionAnswer from '@/components/questionnaire/QuestionAnswer.vue';
import QuestionItem from '@/components/questionnaire/QuestionItem.vue';

const props = defineProps<{
    group: ChatMessageGroup
}>();
</script>

<template>
    <div class="chat-group-questionnaire">
        <div class="chat-questionnaire-start">
            <h3>{{ $t(l.questionnaire_start) }}</h3>
            <div>{{ $t(l.questionnaire_explanation) }}</div>
        </div>
        <template v-for="msg in props.group.messages" v-bind:key="msg.id">
            <div class="chat-questionnaire-row">
                <div class="chat-questionnaire-left">
                </div>
                <div class="chat-questionnaire-right">
                    <QuestionItem :message="msg" />
                </div>
            </div>
            <div class="chat-questionnaire-row">
                <div class="chat-questionnaire-left">
                    <QuestionAnswer :message="msg" />
                </div>
                <div class="chat-questionnaire-right">
                </div>
            </div>
        </template>
        <div v-if="props.group.isCompleted" class="chat-questionnaire-end">
            <h3>{{ $t(l.questionnaire_end) }}</h3>
        </div>
    </div>
</template>

<style scoped>
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

.chat-questionnaire-row {
    display: flex;
    padding: 0.2rem 3rem;
}

.chat-questionnaire-left {
    display: flex;
    justify-content: flex-end;
    border-right: 2px dotted var(--dividers);
    width: calc(50% + 1px);
    flex-shrink: 0;
}

.chat-questionnaire-right {
    display: flex;
    justify-content: flex-start;
    align-self: flex-end;
    width: calc(50% - 3px);
    flex-shrink: 0;
}

@media screen and ((max-aspect-ratio: 1/1) or (max-width: 920px)) {
    .chat-questionnaire-row {
        display: flex;
        flex-direction: column;
        padding: unset;
        width: 100%;
    }

    .chat-questionnaire-left {
        justify-content: flex-start;
        border-right: none;
        width: 100%;
    }

    .chat-questionnaire-right {
        width: 100%;
        justify-content: flex-end;
        border-right: none;
    }
}
</style>