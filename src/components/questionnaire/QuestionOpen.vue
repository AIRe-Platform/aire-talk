<script setup lang="ts">

import { defineComponent, defineProps } from 'vue';
import { QuestionItem } from "@/models/questionnaire";
defineComponent({ name: "QuestionOpen" });

const props = defineProps<{ questionItem: QuestionItem }>()

const submitAnswer = (answer: string|string[]|undefined) => {
    // Stub function for submitting the answer 
    if(answer)
        console.log(answer);
    
}

</script>

<template>
    <div class="chat-message-answers">
        <div class="chat-message-answer">
            <textarea rows="3" class="chat-message-answer-open" :maxlength="props.questionItem.options.max_len" v-if="props.questionItem.options.multiline"></textarea>
            <input type="text" class="chat-message-answer-open" :maxlength="props.questionItem.options.max_len" v-if="!props.questionItem.options.multiline" />
            <button @click="submitAnswer('test')">Submit</button>
        </div>
    </div>
</template>

<style scoped>

</style>