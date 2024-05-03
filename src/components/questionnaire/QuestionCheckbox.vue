<script setup lang="ts">
import { defineProps, ref } from 'vue';
import { answerQuestion } from '@/context/chat';
import { AireQuestionOptionCheckbox } from 'aire';
import { l } from '@/locales';

const props = defineProps<{ 
    message_id: string;
    options: AireQuestionOptionCheckbox;
    answer?: any;
    readonly?: boolean;
 }>();

const answers = ref<string[]>(props.answer || []);
const isUnanswered = (ans: any) => (ans === undefined);

const onClickOption = (answer: string) => {
    if (props.options.multiselect) {
        if (answers.value.includes(answer))
            answers.value = answers.value.filter(x => x !== answer)
        else
            answers.value.push(answer)
    }
    else {
        answers.value = [answer]
        onSubmitAnswer();
    }
}

const onSubmitAnswer = () => {
    if (props.options.multiselect)
        answerQuestion(props.message_id, answers.value)
    else
        answerQuestion(props.message_id, answers.value.values().next().value)
}

</script>

<template>
    <div class="questionnaire-answer">
        <div class="questionnaire-answer-options" v-if="props.options.values">
            <template v-for="ans, id in props.options.values" :key="id">
                <button class="questionnaire-answer-button" @click="onClickOption(ans)" :disabled="props.readonly"
                    :class="{ 'questionnaire-answer-button-selected': answers.includes(ans) }">
                    {{ ans }}
                </button>
            </template>
        </div>
        <div class="questionnaire-answer-actions" v-if="props.options.multiselect && isUnanswered(props.answer)">
            <button class="questionnaire-confirm-button" @click="onSubmitAnswer()">
                {{ $t(l.button_continue) }}
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

.questionnaire-answer-button {
    border: 1px solid var(--border-color);
    background-color: var(--button-color);
    color: var(--button-text);
    transition: all .25s;
}

.questionnaire-answer-button-selected {
    background-color: var(--button-color);
    color: var(--background-color);
}

.questionnaire-answer-button:disabled {
    background-color: var(--button-inactive);
    color: var(--border-color);
}

.questionnaire-answer-button-selected:disabled {
    color: var(--button-text);
    border: 1px solid var(--accent-primary-color);
}
</style>