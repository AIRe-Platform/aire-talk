<script setup lang="ts">
import { defineProps } from 'vue';
import {
    AireQuestionOptionCheckbox,
    AireQuestionOptionNumber,
    AireQuestionOptionOpen,
    AireQuestionOptionRange,
    AireQuestionOptionType
} from "aire";
import QuestionCheckbox from "@/components/questionnaire/QuestionCheckbox.vue";
import QuestionRange from "@/components/questionnaire/QuestionRange.vue";
import QuestionOpen from "@/components/questionnaire/QuestionOpen.vue";
import QuestionNumber from "@/components/questionnaire/QuestionNumber.vue";
import { ChatMessage, ChatState } from '@/models/chat';
import { Chat } from '@/context/chat';

const props = defineProps<{ message: ChatMessage }>()
const isReadonly = (state: ChatState, msg: ChatMessage) => {
    if (!state.questionnaire)
        return true;

    if (msg.question?.questionnaire_id === "system")
        return false;

    return state.questionnaire.active_id !== msg.question?.questionnaire_id
}
</script>

<template>
    <div :id="props.message.id" class="questionnaire-item" v-if="props.message.question">
        <div class="questionnaire-question">
            {{ props.message.question.question }}
        </div>
        <QuestionCheckbox v-if="props.message.question.type == AireQuestionOptionType.Checkbox"
            :message_id="props.message.id" :options="(props.message.question.options as AireQuestionOptionCheckbox)"
            :answer="props.message.question.answer" :readonly="isReadonly(Chat.current, props.message)" />
        <QuestionRange v-if="props.message.question.type == AireQuestionOptionType.Range" :message_id="props.message.id"
            :options="(props.message.question.options as AireQuestionOptionRange)" :answer="props.message.question.answer"
            :readonly="isReadonly(Chat.current, props.message)" />
        <QuestionOpen v-if="props.message.question.type == AireQuestionOptionType.Open" :message_id="props.message.id"
            :options="(props.message.question.options as AireQuestionOptionOpen)" :answer="props.message.question.answer"
            :readonly="isReadonly(Chat.current, props.message)" />
        <QuestionNumber v-if="props.message.question.type == AireQuestionOptionType.Number" :message_id="props.message.id"
            :options="(props.message.question.options as AireQuestionOptionNumber)" :answer="props.message.question.answer"
            :readonly="isReadonly(Chat.current, props.message)" />
    </div>
</template>

<style scoped>
.questionnaire-question {
    font-weight: bold;
    padding: 1rem;
}

.questionnaire-item {
    display: block;
    align-self: center;
    justify-self: center;

    margin: auto;
    margin-top: 3rem;
    margin-bottom: 3rem;
    padding: 0.5rem 1rem;
    max-width: 80%;

    background-color: var(--chat-bubble-background-color);
    box-shadow: 0 0 5px gray;
    line-height: 1.4rem;
    border-radius: 1rem;
    border: 1px solid transparent;
}

/* mobile*/
@media screen and ((max-aspect-ratio: 1/1) or (max-width: 786px)) {}
</style>