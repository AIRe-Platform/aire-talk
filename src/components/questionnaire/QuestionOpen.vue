<script setup lang="ts">
import { defineProps, ref } from 'vue';
import { answerQuestion } from '@/context/chat';
import { AireQuestionOptionOpen } from '@/lib/aire/models/questionnaire';
import { l } from '@/locales';

const props = defineProps<{
    message_id: number;
    options: AireQuestionOptionOpen;
    answer?: any;
    readonly?: boolean;
}>();

const answer = ref<string>(props.answer || "")
const edited = (ans: any) => (!ans || ans !== answer.value);

const onSubmitAnswer = () => {
    answerQuestion(props.message_id, answer.value)
}
</script>

<template>
    <div class="questionnaire-answer">
        <div class="questionnaire-answer-options">
            <textarea class="text-input" rows="3" v-model="answer" :maxlength="props.options.max_len"
                v-if="props.options.multiline" :readonly="props.readonly">
            </textarea>
            <input type="text" class="text-input" v-model="answer" :maxlength="props.options.max_len"
                v-if="!props.options?.multiline" :readonly="props.readonly" />
        </div>
        <div class="questionnaire-answer-actions" v-if="!props.readonly && edited(props.answer)">
            <button class="questionnaire-confirm-button" @click="onSubmitAnswer()">
                {{ $t(l.button_accept) }}
            </button>
        </div>
    </div>
</template>

<style scoped>
.questionnaire-answer {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
}

.questionnaire-answer-options {
    display: flex;
    flex-direction: column;
    align-items: stretch;
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
    border-color: var(--accent-primary-color);
}

.text-input:read-only {
    cursor: not-allowed;
    &:hover {
        box-shadow: unset;
    }
}
</style>