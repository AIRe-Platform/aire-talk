// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

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
import { ChatMessage } from '@/models/chat';
import { l } from '@/locales';
import useQuestionnaire from '@/context/questionnaire';

const questionnaire = useQuestionnaire();
const props = defineProps<{ message: ChatMessage }>()
const isReadonly = (active_id: string | undefined, msg: ChatMessage) => {
    if (!active_id)
        return true;

    if (!msg.question?.questionnaire_id)
        return true;

    return !msg.question.questionnaire_id.startsWith(active_id)
}
</script>

<template>
    <div :id="props.message.id" class="questionnaire-item" v-if="props.message.question">
        <div class="question-answer-title">
            <h3 class="question-answer">{{ $t(l.question_answer) }}<i class="icon questionnaire-answer-default"></i>
            </h3>
        </div>
        <QuestionCheckbox v-if="props.message.question.type == AireQuestionOptionType.Checkbox" :message="props.message"
            :options="(props.message.question.options as AireQuestionOptionCheckbox)"
            :answer="props.message.question.answer" :readonly="isReadonly(questionnaire.active?.id, props.message)" />
        <QuestionRange v-if="props.message.question.type == AireQuestionOptionType.Range" :message="props.message"
            :options="(props.message.question.options as AireQuestionOptionRange)"
            :answer="props.message.question.answer" :readonly="isReadonly(questionnaire.active?.id, props.message)" />
        <QuestionOpen v-if="props.message.question.type == AireQuestionOptionType.Open" :message="props.message"
            :options="(props.message.question.options as AireQuestionOptionOpen)"
            :answer="props.message.question.answer" :readonly="isReadonly(questionnaire.active?.id, props.message)" />
        <QuestionNumber v-if="props.message.question.type == AireQuestionOptionType.Number" :message="props.message"
            :options="(props.message.question.options as AireQuestionOptionNumber)"
            :answer="props.message.question.answer" :readonly="isReadonly(questionnaire.active?.id, props.message)" />
    </div>
</template>

<style lang="scss" scoped>
.questionnaire-question {
    font-weight: bold;
    padding: 1rem;
}

.question-answer {
    text-align: center;
}

.icon.questionnaire-answer-default {
    margin-left: .5rem;
    height: 1.5rem;
    width: 1.5rem;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
    display: inline-block;
    vertical-align: baseline;
}

.questionnaire-item {
    display: block;
    align-self: center;
    justify-self: center;

    margin: 0.5rem 1rem 0.5rem 1rem;
    padding: 0.5rem 1rem;
    max-width: 80%;

    background-color: var(--user-chat-box-background);
    box-shadow: 0 0 5px gray;
    line-height: 1.4rem;
    border-radius: 1rem;
    border: 1px solid transparent;
}
</style>