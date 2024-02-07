<script setup lang="ts">

import { defineComponent, defineProps } from 'vue';
import { QuestionItem } from "@/models/questionnaire";
defineComponent({ name: "QuestionCheckbox" });

const props = defineProps<{ questionItem: QuestionItem }>()

/**
 * Method to select the answer between the answers.
 */
 const clickAnswer = (e: Event, answer: string) => {
    console.log(e);
    console.log(answer);
};

const submitAnswer = (answer: string|string[]|undefined) => {
    // Stub function for submitting the answer 
    if(answer)
        console.log(answer);
}

</script>

<template>
    <div class="chat-message-answers" v-if="!props.questionItem.options.multiselect">
        <div class="chat-message-answer" v-for="answer, id in props.questionItem.options.values" :key="id">
            <button @click="(e) => clickAnswer(e, answer)" class="chat-message-answer-button" :class="{ 'is-selected': answer }" v-if="answer">
                {{ answer }}
            </button>
        </div>
    </div>
    <div class="chat-message-answers" v-if="props.questionItem.options.multiselect">
        <div class="chat-message-answer">
            <div class="chat-message-answer-multi" v-for="answer, id in props.questionItem.options.values" :key="id">
                <input type="checkbox" />
                <label>{{ answer }}</label>
            </div>
            <button @click="submitAnswer(props.questionItem.options.values)">Submit</button>
        </div>
    </div>
</template>

<style scoped>

</style>