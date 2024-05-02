<script setup lang="ts">
import { defineProps, defineEmits, ref } from "vue";
import { Chat, sendChatMessage } from "@/context/chat";
import { l } from "@/locales";

const props = defineProps<{
    optionsOpen: boolean
}>()

defineEmits<{
    toggleOptions: []
}>()

const textInput = ref("");

function submit() {
    const prompt = textInput.value.trim();
    if (prompt.length > 0)
        sendChatMessage(prompt);
    textInput.value = "";
}
</script>

<template>
    <div class="chat-input">
        <div class="chat-bot" :class="{ 'chat-bot-busy': Chat.awaitingResponse, 'chat-bot-finish': Chat.hasFinished }">

        </div>
        <div class="chat-input-header">

            <div class="chat-bot-text">{{ $t(l.chat_input_title) }}</div>
            <div class="chat-options-button" :class="{ 'chat-options-button-active': props.optionsOpen }"
                @click="() => $emit('toggleOptions')">
                <div class="sliders-icon">
                </div>
            </div>
        </div>
        <div class="chat-text-input">
            <form class="chat-input-bar" @submit.prevent="submit">
                <input id="message-input" class="chat-input-field" type="text" autofocus autocomplete="off"
                    :readonly="Chat.awaitingResponse" v-model="textInput" />
            </form>
            <div class="chat-send-button" @click="submit">
                <div class="chat-send-icon">
                    <font-awesome-icon icon="fa-solid fa-paper-plane" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.chat-input {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    border-radius: 1rem 1rem 0 0;
    box-shadow: 0 0 5px var(--box-stroke);
    margin: 0 5px 0 5px;
    padding: 1rem;
    background-color: var(--panel-background-color);
    z-index: 2;
    position: relative;
}

.chat-text-input {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
}

.chat-input-header {
    display: flex;
    justify-content: space-between;
    position: relative;
    align-items: center;
}

.sliders-icon {
    background-image: url("@/assets/icons/aire-icon-summary-switch.svg");
    width: 2rem;
    height: 2rem;
    background-size: cover;
}

.chat-input-bar {
    display: flex;
    flex-shrink: 0;
    flex-grow: 1;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    height: 2rem;
}

.chat-input-field {
    flex-grow: 1;
    color: black;
}

.chat-bot {
    width: 6rem;
    top: 2rem;
    right: 45%;
    height: 6rem;
    margin-top: -4.6rem;
    overflow: hidden;
    position: absolute;
    background-image: url(/src/assets/images/aire-bot.png);
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
}

.chat-bot-busy {
    background-image: url("@/assets/images/aire-bot-thinking.gif");
}

.chat-bot-finish {
    background-image: url("@/assets/images/aire-bot-thinking-finish.png");
}

.chat-bot-text {

    border-radius: 0.5rem;
}

.chat-options-button,
.chat-send-button {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: color .25s;
    padding: 0.2rem;
    color: var(--button-color);

    &:hover {
        color: var(--accent-primary-color);
    }
}

.chat-options-button-active {
    color: var(--accent-primary-color);
}

.chat-options-icon svg,
.chat-send-icon svg {
    width: 1.5rem;
    height: 1.5rem;
}

@media screen and ((max-aspect-ratio: 1/1) or (max-width: 920px)) {
    .chat-options-button {
        position: absolute;
        right: -1rem;
        top: -0.5rem;
    }

    .chat-bot {
        height: 6rem;
        top: 1rem;
        right: 45%;
    }
}


@media screen and ((max-aspect-ratio: 1/1) or (max-width: 640px)) {
    .chat-options-button {
        padding-top: 0rem;
        position: absolute;
        right: -1rem;
        top: -0.7rem;
    }

    .chat-bot {
        height: 4rem;
        top: 2rem;
        right: 36%;
    }
}
</style>
