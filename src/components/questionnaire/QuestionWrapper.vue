<script setup lang="ts">

import { defineComponent, defineProps } from 'vue';
import { QuestionItem, QuestionOptionType } from "@/models/questionnaire";
import QuestionCheckbox from "@/components/questionnaire/QuestionCheckbox";
import QuestionRange from "@/components/questionnaire/QuestionRange";
import QuestionOpen from "@/components/questionnaire/QuestionOpen";

defineComponent({ name: "QuestionWrapper" });

const props = defineProps<{ questionItem: QuestionItem }>()

</script>

<template>
    <div class="chat-message-question" v-if="props.questionItem">
        <span class="chat-message-text">
            {{ questionItem.question }}
        </span>
    </div>
    <QuestionCheckbox :questionItem="props.questionItem" v-if="props.questionItem.type==QuestionOptionType.Checkbox" />
    <QuestionRange :questionItem="props.questionItem" v-if="props.questionItem.type==QuestionOptionType.Range" />
    <QuestionOpen :questionItem="props.questionItem" v-if="props.questionItem.type==QuestionOptionType.Open" />
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