<script setup lang="ts">
import { ChatMessage } from '@/models/chat';
import { scrollToMessage } from '@/helpers/scrollToMessage'
import { defineProps, onMounted, ref } from 'vue';
import { revertToMessage } from '@/context/chat';
import { l } from '@/locales';
import BubbleModal from './BubbleModal.vue';
import SurveyQuestion from './SurveyQuestion.vue'
import ChatBubbleOptions from './ChatBubbleOptions.vue'
import ConfirmDialog from './ConfirmDialog.vue';

const props = defineProps<{ message: ChatMessage, can_revert: boolean }>()
const isSystem = props.message.role === "system";
const isBot = props.message.role === "assistant";

const revertConfirmPopupOpen = ref(false);
const modalOpen = ref(false);

const toggleModal = () => {
    modalOpen.value = !modalOpen.value;
};

const onRevert = () => {
    revertToMessage(props.message.id)
};

let classList: any[] = ["chat-bubble"]
switch (props.message.role) {
    case "assistant": classList.push("chat-bubble-bot"); break;
    case "user": classList.push("chat-bubble-user"); break;
    case "system":
        classList.push("chat-bubble-system");
        break;
}
if (props.message.isError)
    classList.push("chat-bubble-error");

onMounted(() => scrollToMessage(props.message, "end"));

</script>

<template>
    <div :id="props.message.id.toString()" :class=classList @click="toggleModal">
        <BubbleModal :active="modalOpen" :parent="props.message" :onClose="toggleModal"/>
        <ChatBubbleOptions :parent="props.message" :can_revert="props.can_revert" />
        <div class="chat-bubble-content">
            <span class="chat-user-label">{{
                (isSystem || isBot) ? $t(message.sender) : message.sender
            }}</span>
            <span class="chat-message-text" v-if="!(message.question)"> {{
                isSystem ? $t(message.message) : message.message
            }}</span>
            <div class="chat-message-image" v-if="message.image">
                <img v-bind:src="message.image" class="chat-message-image-contain">
            </div>
            <div class="chat-message-video" v-if="message.video">
                <video class="chat-message-video-video" controls>
                    <source v-bind:src="message.video" type="video/mp4">
                </video>
            </div>
            <SurveyQuestion v-if="message.question" :question="message.question" />
        </div>
        <ConfirmDialog :accept="onRevert" :decline="() => { revertConfirmPopupOpen = false }" v-if="revertConfirmPopupOpen">
            {{ $t(l.popup_question_revert_message) }}
        </ConfirmDialog>
    </div>
</template>

<style scoped>
.chat-bubble {
    display: block;
    padding: 0.5rem 1rem;
    margin: 1rem;
    line-height: 1.4rem;
    max-width: 80%;
    background-color: var(--chat-bubble-background-color);
    box-shadow: 0 0 5px gray;
    line-height: 1.4rem;
    border-radius: 1rem;
    border: 1px solid transparent;
    margin-right: 3rem;
}

.chat-bubble-user {
    align-self: flex-start;
    margin-left: 3rem;
}

.chat-bubble-bot {
    margin-right: 0rem;
    height: fit-content;
}

.chat-bubble-system {
    align-self: center;
    margin: 0 3rem;
    border-color: var(--accent-secondary-color);
}

.chat-bubble-error {
    border-color: var(--error-color);
}

.chat-bubble-content {
    display: flex;
    flex-direction: column;
    font-size: small;
}

.chat-user-label {
    font-size: small;
}

.chat-message-text {
    white-space: pre-line;
}

.chat-message-image {
    display: flex;
    justify-content: center;
}

.chat-message-video {
    display: flex;
    justify-content: center;
}

.chat-message-video-video {
    width: 42rem;
    height: 20rem;
}

.chat-message-image-contain {
    height: 80%;
    width: 80%;
    object-fit: contain;
}

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

    .chat-bubble-bot {
        max-width: 70%;
        margin-right: 0rem;
    }

    .chat-message-video-video {
        max-width: 17rem;
        max-height: 12rem;
    }

    .chat-bubble-user {
        margin-left: 0.5rem;
    }
}
</style>