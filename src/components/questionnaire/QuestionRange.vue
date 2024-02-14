<script setup lang="ts">

import { defineProps, ref, toRaw } from 'vue';
import { ChatMessage } from "@/models/chat";
import { answerQuestion } from '@/context/chat';
import { QuestionOptionType } from '@/models/questionnaire';

const props = defineProps<{ message: ChatMessage }>()

let selectedAnswer = ref();

const clickAnswer = (answer: number) => {
    selectedAnswer.value = answer;
}

const submitAnswer = () => {
    if (props.message.questionItem && selectedAnswer.value) {
        answerQuestion(toRaw(props.message.questionItem), toRaw(selectedAnswer.value));
    }
}

const getRange = (): number => {
    const min = props.message.questionItem?.options.min;
    const max = props.message.questionItem?.options.max;
    if (min != null && max != null)
        return max - min;
    else
        return 0;
}

</script>

<template>
    <div v-if="props.message.questionItem?.type == QuestionOptionType.Range && !props.message.answer?.answer">
        <div class="chat-message-answers">
            <div class="chat-message-answer" v-for="answer, id in getRange()" :key="id">
                <button @click="(e) => clickAnswer(answer)" class="chat-message-answer-option"
                    :class="{ 'is-selected': selectedAnswer == answer }" v-if="answer">
                    {{ answer }}
                </button>
            </div>
        </div>
        <button class="chat-message-answer-button" @click="() => submitAnswer()"
            v-if="props.message.questionItem && !props.message.answer?.answer">{{
                $t("button_accept") }}</button>
    </div>
    <div v-if="props.message.answer?.answer">
        <div v-if="props.message.answer.question">
            <span class="questionnaire-question">Question: {{ props.message.answer.question }}</span>
        </div>
        <div v-if="props.message.answer?.answer">
            <span class="questionnaire-answer">You answered: {{ props.message.answer.answer }}</span>
        </div>
    </div>
</template>

<style scoped>
.chat-message-answers {
    display: flex;
    flex-direction: row;
}

.chat-message-answer-option {
    display: flex;
    flex-direction: row;
}

.chat-message-answer-button {
    margin-top: 1em;
    border-color: var(--accent-primary-color);
    float: right;
}

.questionnaire-answer {
    font-style: italic;
}

.questionnaire-question {
    font-weight: bold;
}
</style>