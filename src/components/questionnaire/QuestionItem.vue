<script setup lang="ts">
import { defineProps } from 'vue';
import { ChatMessage } from '@/models/chat';
import { l } from '@/locales';

const props = defineProps<{ message: ChatMessage }>()
</script>

<template>
    <div :id="props.message.id" class="questionnaire-item" v-if="props.message.question">
        <div class="questionnaire-question">
            <h3 class="questionnaire-title">{{ $t(l.questionnaire) }}<i class="icon questionnaire-question"></i></h3>
            {{ props.message.question.question }}
        </div>
    </div>
</template>

<style scoped>

.icon.questionnaire-question {
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
    width: 100%;
    display: block;
    align-self: center;
    justify-self: center;

    margin: auto;
    margin-top: 3rem;
    margin-bottom: 3rem;
    padding: 0.5rem 1rem;
    max-width: 80%;

    background-color: var(--question-background);
    color: var(--button-text);
    box-shadow: 0 0 5px gray;
    line-height: 1.4rem;
    border-radius: 1rem;
    border: 1px solid transparent;
}

/* mobile*/
@media screen and ((max-aspect-ratio: 1/1) or (max-width: 920px)) {}
</style>