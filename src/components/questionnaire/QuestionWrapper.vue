<script setup lang="ts">

import { defineProps } from 'vue';
import { QuestionOptionType } from "@/models/questionnaire";
import QuestionCheckbox from "@/components/questionnaire/QuestionCheckbox.vue";
import QuestionRange from "@/components/questionnaire/QuestionRange.vue";
import QuestionOpen from "@/components/questionnaire/QuestionOpen.vue";
import QuestionNumber from "@/components/questionnaire/QuestionNumber.vue";
import { ChatMessage } from '@/models/chat';

const props = defineProps<{ message: ChatMessage }>()

</script>

<template>
    <div class="chat-message-question">
        <div class="chat-message-question-text " v-if="props.message.questionItem && !props.message.answer?.answer">
            <span class="chat-message-text">
                {{ props.message.questionItem.question }}
            </span>
        </div>
        <QuestionCheckbox :message="props.message"
            v-if="props.message.questionItem?.type == QuestionOptionType.Checkbox || props.message.answer?.type == QuestionOptionType.Checkbox" />
        <QuestionRange :message="props.message"
            v-if="props.message.questionItem?.type == QuestionOptionType.Range || props.message.answer?.type == QuestionOptionType.Range" />
        <QuestionOpen :message="props.message"
            v-if="props.message.questionItem?.type == QuestionOptionType.Open || props.message.answer?.type == QuestionOptionType.Open" />
        <QuestionNumber :message="props.message"
            v-if="props.message.questionItem?.type == QuestionOptionType.Number || props.message.answer?.type == QuestionOptionType.Number" />
    </div>
</template>

<style scoped>
.chat-message-question-text {
    font-weight: bold;
    padding: 1rem;
}

.chat-message-answers {
    display: flex;
    justify-content: space-around;
    padding: 1rem;
}

.chat-message-answer {
    display: flex;
}

.chat-message-question {
    display: block;
    padding: 0.5rem 1rem;
    margin-right: 3rem;
    margin-left: 3rem;
    line-height: 1.4rem;
    max-width: 40%;
    background-color: var(--chat-bubble-background-color);
    box-shadow: 0 0 5px gray;
    line-height: 1.4rem;
    border-radius: 1rem;
    border: 1px solid transparent;
    align-self: flex-end;
    height: fit-content;
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