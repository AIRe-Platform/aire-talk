<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->

<script setup lang="ts">
import { defineProps, ref } from 'vue';
import { AireQuestionOptionContent } from 'aire';
import { l } from '@/locales';
import { ChatMessage } from '@/models/chat';
import useQuestionnaire from '@/context/questionnaire';
import ChatContent from '@/components/chat/ChatContent.vue';

const props = defineProps<{
    message: ChatMessage;
    options?: AireQuestionOptionContent,
    answer?: any;
    readonly?: boolean;
}>();

const answers = ref<string[]>(props.answer || []);
const isUnanswered = (ans: any) => (ans === undefined);

const onClickOption = (answer: string) => {
    if (!props.readonly) {
        if (props.options?.multiselect) {
            if (answers.value.includes(answer))
                answers.value = answers.value.filter(x => x !== answer)
            else
                answers.value.push(answer)
        }
        else {
            answers.value = [answer]
            onSubmitAnswer();
        }
    }
}

const onSubmitAnswer = () => {
    if (!props.readonly) {
        const questionnaire = useQuestionnaire();
        if (props.message.question) {
            if (props.options?.multiselect)
                questionnaire.submitAnswer(props.message.question.question_id, answers.value);
            else
                questionnaire.submitAnswer(props.message.question.question_id, answers.value.values().next().value);
        }
    }

}

</script>

<template>
    <div class="questionnaire-answer">
        <div class="questionnaire-answer-options">
            <div v-for="content in props.options?.contents || []" :key="content.id"
                :class="{ 'disabled': props.readonly }">
                <ChatContent :content="content" :contentId="content.id ?? ''" @click=onClickOption(content.id!)
                    :class="{ 'questionnaire-answer-button-selected': answers.includes(content.id!), 'disabled2': props.readonly }" />
            </div>
            <div class="questionnaire-answer-actions" v-if="props.options?.multiselect && isUnanswered(props.answer)">
                <button class="btn questionnaire-confirm-button" @click="onSubmitAnswer()">
                    {{ $t(l.button_continue) }}
                </button>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.questionnaire-answer {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
}

.disabled2 {
    pointer-events: none;
    background-color: var(--button-inactive);
    border: solid 1px var(--accent-primary-color);
}

.disabled {
    cursor: not-allowed;
}

.questionnaire-answer-options {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.questionnaire-answer-actions {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: center;
    gap: 0.5rem;
}

.questionnaire-confirm-button {
    border: 1px solid var(--border-color);
}

.questionnaire-answer-button {
    border: 1px solid var(--border-color);
    background-color: var(--panel-background-color);
    color: var(--accent-primary-color);
    transition: all .25s;
}

.questionnaire-answer-button-selected {
    background-color: var(--accent-primary-color);
    color: var(--background-color);
}

.questionnaire-answer-button:disabled {
    background-color: var(--button-inactive);
    color: var(--border-color);
}

.questionnaire-answer-button-selected:disabled {
    color: var(--button-text);
    border: 1px solid var(--accent-primary-color);
}
</style>