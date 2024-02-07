<script setup lang="ts">

import { defineComponent, defineProps } from 'vue';
import { QuestionItem, QuestionOption } from "@/models/questionnaire";
defineComponent({ name: "QuestionNumber" });

const props = defineProps<{ questionItem: QuestionItem }>()


/**
 * Method to select the answer between the answers.
 */
 const clickAnswer = (e: Event, answer: number) => {
    console.log(e);
    console.log(answer);
};

// const options : QuestionOption = props.questionItem.options;
// const min : number = options?.min;
// const max : number = options?.max;

</script>

<template>
    <div class="chat-message-answers">
        <div class="chat-message-answer" v-for="answer, id in props.questionItem.options.max-props.questionItem.options.min" :key="id">
            <button @click="(e) => clickAnswer(e, answer)" class="chat-message-answer-button" :class="{ 'is-selected': answer }" v-if="answer">
                {{ answer }}
            </button>
        </div>
    </div>
</template>

<style scoped>

</style>