<script setup lang="ts">

import { defineProps, ref } from 'vue';
import { ChatMessage, Answer } from "@/models/chat";
import { answerQuestion } from '@/context/chat';

const props = defineProps<{ message: ChatMessage }>()

const answer = ref('')

const submitAnswer = () => {
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

</script>

<template>
    <div class="chat-message-answers">
        <div class="chat-message-answer">
            <input type="number" v-model="answer" :min="props.message.questionItem?.options.min" :max="props.message.questionItem?.options.max">
            <button @click="submitAnswer">Submit</button>
            <span v-if="props.message.answer?.answer">You answered: {{ props.message.answer.answer }}</span>
        </div>
    </div>
</template>

<style scoped></style>