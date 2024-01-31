<script setup lang="ts">
import { ChatMessage } from '@/models/chat';
import SurveyQuestion from './SurveyQuestion.vue'
import { scrollToMessage } from '@/helpers/scrollToMessage'
import { defineProps, onMounted, ref } from 'vue';
import BubbleModal from './BubbleModal.vue';
import { Chat } from '@/context/chat';
import popUp from './PopUp.vue';
import { l } from '@/locales';

const props = defineProps<{ message: ChatMessage }>()
const id = props.message.timestamp.toString();
const isSystem = props.message.role === "system";
const isBot = props.message.role === "assistant";
let isPopUpRevertMessageOpen = ref(false);
let revertMessageTo = ref<ChatMessage>();

// show Modal 
const isModalActivate = ref(false);
// show Menu
const isMenuShown = ref(false);

/**
 * Toggle the popup component to revert message
 */
const toggleRevertMessagePopUp = (message?: ChatMessage) => {
    isPopUpRevertMessageOpen.value = !(isPopUpRevertMessageOpen.value);
    revertMessageTo.value = message;
    toggleMenu();
};

/**
 * Toggle the modal of the ChatMessage selected.
 * @param message 
 */
const toggleModal = (message: ChatMessage) => {
    if (!message.question)
        isModalActivate.value = !isModalActivate.value;
};

/**
 * Toggle the Menu
 */
const toggleMenu = () => {
    isMenuShown.value = !isMenuShown.value;
};

/**
 * TODO 
 * @param answer 
 */
const copyClipboard = (message: ChatMessage) => {
    message.isCopiedClipboard = !message.isCopiedClipboard;
    console.log("message copied on Clipboard!", message);
};

/**
 *  TODO change into undo the next messages from this one.
 * @param message 
 */
const revertToMessage = () => {
    if (revertMessageTo.value) {
        console.log("revertToMessage:", revertMessageTo.value.id);
        console.log("revertToMessage Chat:", Chat.history);
        console.log("message reverted to (alert before doing it.)", revertMessageTo.value);
        Chat.reset(revertMessageTo.value.id);
        toggleMenu();
        toggleRevertMessagePopUp();
    } else {
        console.log("Error while reverting to message...");
    }

};

/**
 * Method to switch the thumbs up button. Do the logic to swith off the other one if needed.
 * TODO change it into use the rating number 1 thumsUp 0 nothing -1 thumsDown
 * @param message 
 */
const thumbsUp = (message: ChatMessage) => {

    message.isThumbsUp = !message.isThumbsUp;
    if (message.isThumbsUp && message.isThumbsDown)
        message.isThumbsDown = false;
};

/**
 * Method to switch the thumbs down button. Do the logic to swith off the other one if needed.
 * @param message 
 */
const thumbsDown = (message: ChatMessage) => {

    message.isThumbsDown = !message.isThumbsDown;
    if (message.isThumbsDown && message.isThumbsUp)
        message.isThumbsUp = false;
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
    <BubbleModal :isModalActivate="isModalActivate">
        <div class="modal-component">
            <div class="modal-content">
                <div class="modal-header">
                    <h1>{{ message.sender }}</h1>
                </div>
                <div class="modal-body">
                    <p v-if="!message.question"> {{ message.message }}</p>
                    <div class="modal-body-image" v-if="message.image">
                        <img v-bind:src="message.image" class="chat-message-image-contain">
                    </div>
                    <div class="chat-bubble-modal-body-video-container" v-if="message.video">
                        <video class="chat-bubble-modal-body-video" controls>
                            <source v-bind:src="message.video" type="video/mp4">
                        </video>
                    </div>
                    <SurveyQuestion v-if="message.question" :question="message.question" />
                </div>
            </div>
            <div class="modal-button">
                <div @click="toggleModal(message)" type="button">
                    <font-awesome-icon icon="fa-solid fa-xmark" />
                </div>
            </div>
        </div>
    </BubbleModal>
    <div :id=id :class=classList @click="toggleModal(message)">
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
    </div>
    <div class="chat-bubble-options-menu-relative">
        <div class="chat-bubble-options-menu" v-if="!isSystem && isMenuShown">
            <button @click="thumbsUp(message)" class="chat-message-answer-options-menu-button"
                :class="{ 'is-selected': message.isThumbsUp }">
                <font-awesome-icon icon="fa-solid fa-thumbs-up" />
            </button>
            <button @click="thumbsDown(message)" class="chat-message-answer-options-menu-button"
                :class="{ 'is-selected': message.isThumbsDown }">
                <font-awesome-icon icon="fa-solid fa-thumbs-down" />
            </button>
            <button @click="copyClipboard(message)" class="chat-message-answer-options-menu-button"
                :class="{ 'is-selected': message.isCopiedClipboard }">
                <font-awesome-icon icon="fa-solid fa-copy" />
            </button>
            <button @click="toggleRevertMessagePopUp(message)" class="chat-message-answer-options-menu-button">
                <font-awesome-icon icon="fa-solid fa-trash" />
            </button>
        </div>
    </div>
    <div class="chat-bubble-options-menu-dots" v-if="!isSystem" @click="toggleMenu()">
        <font-awesome-icon icon="fa-solid fa-ellipsis-vertical" />
    </div>
    <popUp v-if="isPopUpRevertMessageOpen">
        <div class="popup-content">
            <div class="popup-question">
                {{ $t(l.popup_question_one) }}
            </div>
            <div class="popup-buttons">
                <button class="popup-button-accept" @click="revertToMessage()">
                    <a class="nav-link" href="#"> {{ $t(l.popup_button_accept) }} </a>
                </button>
                <button class="popup-button-cancel" @click="toggleRevertMessagePopUp()">
                    <a class="nav-link" href="#"> {{ $t(l.popup_button_cancel) }} </a>
                </button>
            </div>
        </div>
    </popUp>
</template>

<style scoped>
.popup-content {
    padding: 2rem;
}

.popup-question {
    font-size: small;
    font-family: var(--font-family);
}

.popup-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 3rem;
}

.modal-component {
    display: flex;
    justify-content: space-between;
    z-index: 2;
}

.modal-body-image {
    display: flex;
    justify-content: center;
}

.modal-button {
    cursor: pointer;
    width: 2rem;
    display: flex;
    justify-content: center;
}

.chat-bubble {
    display: block;
    padding: 0.5rem 1rem;
    margin: 1rem;
    line-height: 1.4rem;
    max-width: 42rem;
    background-color: var(--chat-bubble-background-color);
    box-shadow: 0 0 5px gray;
    line-height: 1.4rem;
    border-radius: 1rem;
    border: 1px solid transparent;
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

.chat-message-answer-options-menu-button {
    cursor: pointer;
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

.chat-bubble-modal-body-video {
    width: 40rem;
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

.chat-bubble-options-menu-relative {
    position: relative;
}

.chat-bubble-options-menu {
    display: flex;
    height: 10rem;
    left: -3.5rem;
    top: 1rem;
    flex-direction: column;
    justify-content: space-around;
    position: absolute;
}

.chat-bubble-options-menu-dots {
    background-color: var(--chat-bubble-background-color);
    cursor: pointer;
    margin: 1rem;
    height: 1.2rem;
    width: 1.2rem;
    display: flex;
    justify-content: center;
    border-radius: 50px;
    align-items: center;
    border-color: white;
    border-style: solid;
    border: 1px solid transparent;
    box-shadow: 0 0 5px gray;
    line-height: 1.4rem;
    margin-left: -0.35rem;
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

    .chat-bubble-modal-body-video-container {
        margin-top: 1rem;
    }

    .chat-bubble-modal-body-video {
        max-width: 18.5rem;
        max-height: 15rem;
    }

    .chat-message-answer-options-menu-button {
        transform: scale(0.5);
    }

    .chat-bubble-options-menu-relative {
        position: unset;
    }

    .chat-bubble-options-menu {
        background-color: var(--chat-bubble-background-color);
        left: 19.5rem;
        width: 2rem;
        position: absolute;
        display: flex;
        height: -moz-fit-content;
        height: fit-content;
        align-items: center;
    }

    .chat-bubble-user {
        margin-left: 0.5rem;
    }
}
</style>