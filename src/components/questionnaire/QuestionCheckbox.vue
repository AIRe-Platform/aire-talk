<script setup lang="ts">

import { defineProps } from 'vue';
import { ChatMessage, Answer } from '@/models/chat';
import { answerQuestion } from '@/context/chat';

const props = defineProps<{ message: ChatMessage }>()

//const answers = ref([]) // TODO: handle multiple checkbox answers

const submitAnswer = (answer: string) => {

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

<template v-if="props.questionItem.type == QuestionOptionType.Checkbox">
    <div class="chat-message-answers" v-if="!props.message.questionItem?.options.multiselect">
        <div class="chat-message-answer" v-for="answer, id in props.message.questionItem?.options.values" :key="id">
            <button @click="(e) => submitAnswer(answer)" class="chat-message-answer-button" :class="{ 'is-selected': answer }" v-if="answer">
                {{ answer }}
            </button>
        </div>
    </div>
    <div class="chat-message-answers" v-if="props.message.questionItem?.options.multiselect">
        <div class="chat-message-answer">
            <div class="chat-message-answer-multi" v-for="answer, id in props.message.questionItem.options.values" :key="id">
                <input  type="checkbox" @click="(e) => submitAnswer(answer)"/>
                <label>{{ answer }}</label>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>