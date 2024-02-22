<script setup lang="ts">
import { defineProps } from 'vue';
import { answerQuestion } from '@/context/chat';
import { AireQuestionOptionRange } from '@/lib/aire/models/questionnaire';

const props = defineProps<{
    message_id: number;
    options: AireQuestionOptionRange;
    answer?: any
}>();

const answered = (answer: any) => (answer !== undefined);
const range = [...Array(1 + props.options.max - props.options.min).keys()].map(x => x + props.options.min)

const onSubmitAnswer = async (value: number) => {
    await answerQuestion(props.message_id, value)
}
</script>

<template>
    <div class="questionnaire-answer">
        <div class="questionnaire-answer-options">
            <template v-for="ans, id in range" :key="id">
                <button @click="onSubmitAnswer(ans)" class="questionnaire-range-button"
                    :class="{ 'questionnaire-range-button-selected': props.answer == ans }" :disabled="answered(props.answer)">
                    {{ ans }}
                </button>
            </template>
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

.questionnaire-range-button {
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