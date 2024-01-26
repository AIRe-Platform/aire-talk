<script setup lang="ts">

import { defineComponent, defineProps, ref } from 'vue';
import { Question, Answer } from "@/models/chat";
defineComponent({ name: "SurveyQuestion" });
const selectedAnswer = ref<Answer>();

const props = defineProps<{ question: Question }>()


let openAnswer = ref([{}])

/**
 * Method to select the answer between the answers.
 * First unselect all the anwsers and then select the correct one.
 * @param answer TO DO change into interface ask Niko how...
 */
const clickAnswer = (e: Event, answer: Answer) => {
    selectedAnswer.value = answer;
    if (!props.question.options)
        return;
    if(props.question.options.type === "single-select") {
        for (let oldAnswer of props.question.options.answers) {
            if (oldAnswer.isSelected)
                oldAnswer.isSelected = false;
        }
    }
    if(props.question.options.type === "multi-select") { // TODO: doesn't work like this ->
        let checked = (e.target as HTMLInputElement).checked;
        answer.isSelected = checked
    }
    answer.isSelected = true;
    selectedAnswer.value.isSelected = true;
};

const submitAnswer = (answer: Answer|Answer[]) => {
    // Stub function for submitting the answer 
    console.log(answer);
    
}

</script>

<template>
    <div class="chat-message-question" v-if="props.question">
        <span class="chat-message-text">
            {{ question.question }}
        </span>
    </div>
    <div class="chat-message-answers" v-if="props.question.options.type==='single-select'">
        <div class="chat-message-answer" v-for="answer, id in props.question.options.answers" :key="id">
            <button @click="(e) => clickAnswer(e, answer)" class="chat-message-answer-button"
                :class="{ 'is-selected': answer.isSelected }" v-if="answer.answer">
                {{ answer.answer }}
            </button>
            <button @click="(e) => clickAnswer(e, answer)" class="chat-message-answer-button"
                :class="{ 'is-selected': answer.isSelected }" v-if="!answer.answer">
                {{ answer.id }}
            </button>
        </div>
    </div>
    <div class="chat-message-answers" v-if="props.question.options.type==='open'">
        <div class="chat-message-answer">
            <textarea rows="3" class="chat-message-answer-open" v-model="openAnswer[props.question.id ? props.question.id : 0].answer" />
            <button @click="submitAnswer(openAnswer[props.question.id ? props.question.id : 0].answer)">Submit</button>
        </div>
    </div>
    <div class="chat-message-answers" v-if="props.question.options.type==='multi-select'">
        <div class="chat-message-answer">
            <div class="chat-message-answer-multi" v-for="answer, id in props.question.options.answers" :key="id">
                <input type="checkbox" @change="(e) => clickAnswer(e, answer)" v-bind:checked="answer.isSelected" />
                <label>{{ answer.answer }}</label>
            </div>
            <button @click="submitAnswer(props.question.options.answers)">Submit</button>
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