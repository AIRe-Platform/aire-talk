// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

<script setup lang="ts">
import { defineProps } from 'vue';
import { ChatMessage } from '@/models/chat';
import { l } from '@/locales';

const props = defineProps<{ message: ChatMessage }>()
</script>

<template>
    <div :id="props.message.id" class="questionnaire-item" v-if="props.message.question">
        <div class="questionnaire-question">
            <h3 class="questionnaire-title">{{ $t(l.questionnaire) }}<i class="icon questionnaire-question-default"></i>
            </h3>
            {{ props.message.question.question }}
        </div>
    </div>
</template>

<style lang="scss" scoped>
.icon.questionnaire-question-default {
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

    background-color: var(--question-background);
    color: var(--button-text);
    box-shadow: 0 0 5px gray;
    line-height: 1.4rem;
    border-radius: 1rem;
    border: 1px solid transparent;
}
</style>