<script setup lang="ts">

import { defineProps, ref, toRaw } from 'vue';
import { ChatMessage } from "@/models/chat";
import { answerQuestion } from '@/context/chat';

const props = defineProps<{ message: ChatMessage }>()
const answer = ref('')

const submitAnswer = () => {
    if (props.message.questionItem) {
        answerQuestion(toRaw(props.message.questionItem), toRaw(answer.value));
    }
}

</script>

<template>
    <div v-if="!props.message.answer?.answer">
        <div class="chat-message-answers">
            <div class="chat-message-answer">
                <textarea rows="3" class="chat-message-answer-open" v-model="answer"
                    :maxlength="props.message.questionItem?.options.max_len"
                    v-if="props.message.questionItem?.options.multiline"></textarea>
                <input type="text" class="chat-message-answer-open" v-model="answer"
                    :maxlength="props.message.questionItem?.options.max_len"
                    v-if="!props.message.questionItem?.options.multiline" />
            </div>
        </div>
        <button class="chat-message-answer-button" @click="submitAnswer()"
            v-if="props.message.questionItem">{{ $t("button_accept")
            }}</button>
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
.chat-message-answer-open {
    width: 100%;
    margin-bottom: 0.6rem;
}

.chat-message-answer {
    display: flex;
}

.chat-message-answer-button {
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