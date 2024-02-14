<script setup lang="ts">

import { defineProps, ref, toRaw } from 'vue';
import { ChatMessage } from '@/models/chat';
import { answerQuestion } from '@/context/chat';

const props = defineProps<{ message: ChatMessage }>();

interface MultiselectAnswer {
    id: string,
    value: string;
    checked: boolean;
}

let multiselectAnswers = ref(Array<MultiselectAnswer>());
let singleAnswer = ref("");

props.message.questionItem?.options.values?.map(value => {
    multiselectAnswers.value.push({ id: value, value: value, checked: false })
})

const clickAnswer = (answer: string) => {
    singleAnswer.value = answer;
}

const submitAnswer = () => {
    if (props.message.questionItem) {
        let answers: string[] = []
        multiselectAnswers.value.map(a => {
            if (a.checked)
                answers.push(a.value)
        });
        answerQuestion(toRaw(props.message.questionItem), answers)
    }
}

</script>

<template>
    <div class="chat-message-answers"
        v-if="!props.message.questionItem?.options.multiselect && !props.message.answer?.answer">
        <div class="chat-message-answer" v-for="answer, id in props.message.questionItem?.options.values" :key="id">
            <button @click="(e) => clickAnswer(answer)" class="chat-message-answer"
                :class="{ 'is-selected': singleAnswer == answer }" v-if="answer">
                {{ answer }}
            </button>
        </div>
    </div>
    <div class="chat-message-answers"
        v-if="props.message.questionItem?.options.multiselect && !props.message.answer?.answer">
        <div class="chat-message-answer">
            <div class="chat-message-answer-multi" v-for="answer, id in multiselectAnswers" :key="id">
                <input type="checkbox" v-model="answer.checked" />
                <label :for="answer.id">{{ answer.value }}</label>
            </div>
        </div>
    </div>
    <button class="chat-message-answer-button" @click="() => submitAnswer()"
        v-if="props.message.questionItem && !props.message.answer?.answer">{{
            $t("button_accept") }}</button>
    <div v-if="props.message.answer?.answer">
        <div v-if="props.message.answer.question">
            <span class="questionnaire-question">Question: {{ props.message.answer.question }}</span>
        </div>
        <div v-if="props.message.answer?.options.multiselect">
            <span class="questionnaire-answer">You answered: {{ props.message.answer.answer.join(", ") }}</span>
        </div>
        <div v-if="!props.message.answer?.options.multiselect">
            <span class="questionnaire-answer">You answered: {{ props.message.answer.answer }}</span>
        </div>
    </div>
</template>

<style scoped>
.chat-message-answers {
    display: flex;
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
}</style>