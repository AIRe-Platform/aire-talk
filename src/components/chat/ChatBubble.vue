<script setup lang="ts">
import { ChatMessage } from '@/models/chat';
import { defineProps, ref } from 'vue';
import { Chat, revertToMessage } from '@/context/chat';
import { l } from '@/locales';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import ChatBubbleOptions from './ChatBubbleOptions.vue'
import ChatBubbleModal from './ChatBubbleModal.vue';

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
</script>

<template>
    <div :id="props.message.id" :class=classList @click="toggleModal">
        <ChatBubbleModal :active="modalOpen" :parent="props.message" :onClose="toggleModal" />
        <ChatBubbleOptions :parent="props.message" :can_revert="props.can_revert"
            v-if="props.message.role === 'assistant'" />
        <div class="chat-bubble-content">
            <span class="chat-user-label">{{
                (isSystem || isBot) ? $t(message.sender) : message.sender
                }}</span>
            <span class="chat-message-text">
                {{
                    isSystem
                        ? (message.message === l.system_topic && Chat.current.topic
                            ? ($t(message.message!) + $t(Chat.current.topic.localization_key))
                            : $t(message.message!))
                        : message.message
                }}
            </span>
            <div class="chat-message-image" v-if="message.image">
                <img v-bind:src="message.image" class="chat-message-image-contain">
            </div>
            <div class="chat-message-video" v-if="message.video">
                <video class="chat-message-video-video" controls>
                    <source v-bind:src="message.video" type="video/mp4">
                </video>
            </div>
        </div>
        <ConfirmDialog :accept="onRevert" :decline="() => { revertConfirmPopupOpen = false }"
            v-if="revertConfirmPopupOpen">
            {{ $t(l.popup_confirm_revert_message) }}
        </ConfirmDialog>
    </div>
</template>

<style lang="scss" scoped>
.chat-bubble {
    display: block;
    padding: 0.5rem 1rem;
    margin-right: 1rem;
    margin-left: 1rem;
    line-height: 1.4rem;
    /* background-color: var(--chat-bubble-background-color); */
    line-height: 1.4rem;
    border-radius: 1rem;
    border: 2px solid var(--box-stroke);
}

.chat-bubble-user {
    align-self: flex-start;
    background-color: var(--user-chat-box-background);
}

.chat-bubble-bot {
    align-self: flex-end;
    height: fit-content;
    background-color: var(--ia-chat-box-background);
}

.chat-bubble-system {
    align-self: center;
    max-width: 80%;
    margin-left: 3rem;
    background-color: var(--ia-chat-box-background);
}

.chat-bubble-error {
    border-color: var(--error-color);
}

.chat-bubble-content {
    display: flex;
    flex-direction: column;
    font-size: var(--font-medium);
}

.chat-user-label {
    font-size: var(--font-medium);
    font-weight: bold;
}

.chat-bubble-bot .chat-user-label {
    color: var(--chat-bubble-bot-label);
}

.chat-bubble-user .chat-user-label {
    color: var(--accent-primary-color);
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

.ui-mode-mobile {
    .chat-bubble {
        max-width: unset;
        margin: 0.5rem 1rem 0.5rem 0.3rem
    }

    .chat-message-question {
        padding: 0;
    }

    .chat-message-video-video {
        max-width: 17rem;
        max-height: 12rem;
    }

    .chat-bubble-content {
        font-size: var(--font-small);
    }
}
</style>