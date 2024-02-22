<script setup lang="ts">
import { defineProps, ref } from 'vue';
import { answerQuestion } from '@/context/chat';
import { AireQuestionOptionNumber } from '@/lib/aire/models/questionnaire';

const props = defineProps<{
    message_id: number;
    options?: AireQuestionOptionNumber;
    answer?: any
}>();

const answered = (answer: any) => (answer !== undefined);
const answer = ref(props.answer as number || props.options?.default)

const onSubmitAnswer = () => {
    if (answer.value)
        answerQuestion(props.message_id, answer.value)
}
</script>

<template>
    <div class="questionnaire-answer">
        <div class="questionnaire-answer-options">
            <input type="number" v-model="answer" :min="props.options?.min" :max="props.options?.max"
                :disabled="answered(props.answer)">
        </div>
        <div class="questionnaire-answer-actions" v-if="!answered(props.answer)">
            <button class="questionnaire-confirm-button" @click="onSubmitAnswer()">
                {{ $t("button_accept") }}
            </button>
        </div>
    </div>
</template>

<style scoped>
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
    border-color: var(--accent-primary-color);
}
</style>