<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->

<script setup lang="ts">
import { defineProps } from 'vue';
import { AireQuestionOptionRange } from 'aire';
import { ChatMessage } from '@/models/chat';
import useQuestionnaire from '@/context/questionnaire';

const props = defineProps<{
    message: ChatMessage;
    options: AireQuestionOptionRange;
    answer?: any
    readonly?: boolean
}>();

const range = [...Array(1 + props.options.max - props.options.min).keys()].map(x => x + props.options.min)

const onSubmitAnswer = (value: number) => {
    const questionnaire = useQuestionnaire();
    if (props.message.question) {
        questionnaire.submitAnswer(props.message.question.question_id, value);
    }
}
</script>

<template>
    <div class="questionnaire-answer">
        <div class="questionnaire-answer-options">
            <template v-for="ans, id in range" :key="id">
                <button @click="onSubmitAnswer(ans)" class="questionnaire-range-button"
                    :class="{ 'questionnaire-range-button-selected': props.answer == ans }" :disabled="props.readonly">
                    {{ ans }}
                </button>
            </template>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.questionnaire-answer {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
}

.questionnaire-answer-options {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.questionnaire-answer-actions {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: center;
    gap: 0.5rem;
}

.questionnaire-confirm-button {
    border: 1px solid var(--border-color);
}

.questionnaire-range-button {
    color: var(--accent-primary-color);
    border: 1px solid var(--border-color);
    background-color: var(--panel-background-color);
    height: 3rem;
    width: 3rem;
    border-radius: 1.5rem;
    transition: all .25s;
}

.questionnaire-range-button:disabled {
    background-color: transparent;
    color: var(--border-color);
}

.questionnaire-range-button-selected {
    background-color: var(--accent-primary-color);
    color: var(--background-color);
}

.questionnaire-range-button-selected:disabled {
    color: var(--accent-primary-color);
    border: 1px solid var(--accent-primary-color);
}
</style>