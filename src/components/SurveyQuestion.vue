<script setup lang="ts">

import { defineComponent, defineProps, ref } from 'vue';
import { Question, Answer } from "@/models/chat";
defineComponent({ name: "SurveyQuestion" });
const selectedAnswer = ref<Answer>();

const props = defineProps<{ question: Question }>()


/**
 * Method to select the answer between the answers.
 * First unselect all the anwsers and then select the correct one.
 * @param answer TO DO change into interface ask Niko how...
 */
const clickAnswer = (answer: Answer) => {
    selectedAnswer.value = answer;
    if (!props.question.options)
        return;
    for (let oldAnswer of props.question.options.answers) {
        if (oldAnswer.isSelected)
            oldAnswer.isSelected = false;
    }
    answer.isSelected = true;
    selectedAnswer.value.isSelected = true;
};

</script>

<template>
    <div class="chat-message-question" v-if="props.question">
        <span class="chat-message-text">
            {{ question.question }}
        </span>
    </div>
    <div class="chat-message-answers" v-if="props.question.options.type==='single-select'">
        <div class="chat-message-answer" v-for="answer, id in props.question.options.answers" :key="id">
            <button @click="clickAnswer(answer)" class="chat-message-answer-button"
                :class="{ 'is-selected': answer.isSelected }" v-if="answer.answer">
                {{ answer.answer }}
            </button>
            <button @click="clickAnswer(answer)" class="chat-message-answer-button"
                :class="{ 'is-selected': answer.isSelected }" v-if="!answer.answer">
                {{ answer.id }}
            </button>
        </div>
    </div>
    <div class="chat-message-answers" v-if="props.question.options.type==='open'">
        <div class="chat-message-answer">
            <textarea rows="3" class="chat-message-answer-open" />
        </div>
    </div>
    <div class="chat-message-answers" v-if="props.question.options.type==='multi-select'">
        <div class="chat-message-answer">
            <div class="chat-message-answer-multi" v-for="answer, id in props.question.options.answers" :key="id">
                <input type="checkbox" />
                <label>{{ answer.answer }}</label>
            </div>
        </div>
    </div>
</template>

<style scoped>
.chat-message-question {
    font-weight: bold;
    padding: 1rem;
}

.chat-message-answers {
    display: flex;
    justify-content: space-around;
    padding: 1rem;
}

.chat-message-answer-button {
    cursor: pointer;
}


/* mobile*/
@media screen and (max-width: 600px) {

    .chat-message-question {
        padding: 0;
    }

    .chat-bubble-content {
        font-size: x-small;
    }

    .chat-message-answers {
        display: flex;
        flex-direction: column;
        padding-left: 1rem;
        padding-top: 0;
        padding-bottom: 0;
    }

    .chat-message-answer {
        margin-top: 0.3rem;
    }

    .chat-message-answer-button {
        width: 14.5rem;
        font-size: x-small;
    }
}</style>