// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

<script setup lang="ts">
import { defineProps, ref } from 'vue';
import { AireQuestionOptionNumber } from 'aire';
import { l } from '@/locales';
import { ChatMessage } from '@/models/chat';
import useQuestionnaire from '@/context/questionnaire';

const props = defineProps<{
    message: ChatMessage;
    options?: AireQuestionOptionNumber;
    answer?: any;
    readonly?: boolean;
}>();

const answer = ref(props.answer as number || props.options?.default)
const edited = (ans: any) => (!ans || ans !== answer.value);

const onSubmitAnswer = () => {
    const questionnaire = useQuestionnaire();
    if (props.message.question) {
        questionnaire.submitAnswer(props.message.question.question_id, answer.value);
    }
}
</script>

<template>
    <div class="questionnaire-answer">
        <div class="questionnaire-answer-options">
            <input :id="props.message.id + '_input'" type="number" v-model="answer" :min="props.options?.min"
                :max="props.options?.max" :disabled="props.readonly">
        </div>
        <div class="questionnaire-answer-actions" v-if="!props.readonly && edited(props.answer)">
            <button class="questionnaire-confirm-button" @click="onSubmitAnswer()">
                {{ $t(l.button_accept) }}
            </button>
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

    input {
        font-size: 2rem;
        width: 10rem;
    }

    input:disabled {
        cursor: not-allowed;

        &:hover {
            box-shadow: unset;
        }
    }
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
</style>