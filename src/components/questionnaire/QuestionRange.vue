<script setup lang="ts">

import { defineProps } from 'vue';
import { ChatMessage, Answer } from "@/models/chat";
import { answerQuestion } from '@/context/chat';

const props = defineProps<{ message: ChatMessage }>()

const submitAnswer = (answer:number) => {
    const answerObject: Answer = {
        question_id: props.message.questionItem?.id,
        type: props.message.questionItem?.type,
        answer: answer,
        options: props.message.questionItem?.options,
        question: props.message.questionItem?.question

    }
    if (props.message.questionItem)
        answerQuestion(props.message.questionItem,answerObject);
}

function getRange() : number {
    const min = props.message.questionItem?.options.min;
    const max = props.message.questionItem?.options.max;
    if (min != null && max != null)
        return max-min;
    else return 0;
}

</script>

<template>
    <div class="chat-message-answers">
        <div class="chat-message-answer" v-for="answer, id in getRange()" :key="id">
            <button @click="(e) => submitAnswer(answer)" class="chat-message-answer-button" :class="{ 'is-selected': answer }" v-if="answer">
                {{ answer }}
            </button>
        </div>
        <span v-if="props.message.answer?.answer">You answered: {{ props.message.answer.answer }}</span>
    </div>
</template>

<style scoped>

</style>