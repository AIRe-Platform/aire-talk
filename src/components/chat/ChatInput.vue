<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import { Chat, sendChatMessage } from "@/context/chat";
import { l } from "@/locales";

const props = defineProps<{
    optionsOpen: boolean
}>()

defineEmits<{
    toggleOptions: []
}>()

function submit(event: Event) {
    const form = event.target as HTMLFormElement;
    const el = form.firstChild as HTMLInputElement;
    const prompt = el.value.trim();

    if (prompt.length > 0) sendChatMessage(el.value);
    el.value = "";
}
</script>

<template>
    <div class="chat-input">
        <div class="chat-bot" :class="{ 'chat-bot-busy': Chat.awaitingResponse }">
            <div class="chat-bot-text">{{ $t(l.chat_input_title) }}</div>
            <div class="chat-options-button" :class="{ 'chat-options-button-active': props.optionsOpen }"
                @click="() => $emit('toggleOptions')">
                <div class="chat-options-icon">
                    <font-awesome-icon icon="fa-solid fa-sliders" />
                </div>
            </div>
        </div>
        <form class="chat-input-bar" @submit.prevent="submit">
            <input id="message-input" class="chat-input-field" type="text" autofocus autocomplete="off"
                :readonly="Chat.awaitingResponse" />
        </form>
    </div>
</template>

<style scoped>
.chat-input {
    border-radius: 1rem 1rem 0 0;
    box-shadow: 0 0 5px var(--shadow-color);
    margin: 0 5px 0 5px;
    padding: 1rem;
    background-color: var(--background-color);
    z-index: 2;
}

.chat-input-bar {
    display: flex;
    flex-shrink: 0;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    padding: 0.5rem;
    height: 2rem;
}

.chat-input-field {
    flex-grow: 1;
}

.chat-bot {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
    height: 6rem;
    margin-top: -4.6rem;
    overflow: hidden;

    background-image: url("@/assets/images/aire-bot.png");
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
}

.chat-bot-busy {
    background-image: url("@/assets/images/aire-bot-thinking.gif");
}

.chat-bot-text {
    background-color: var(--background-color);
    box-shadow: 0 0 5px 5px var(--background-color);
    border-radius: 0.5rem;
}

.chat-options-button {
    cursor: pointer;
    transition: color .25s;
    padding: 0.2rem;

    &:hover {
        color: var(--accent-primary-color);
    }
}

.chat-options-button-active {
    color: var(--accent-primary-color);
}

.chat-options-icon svg {
    width: 1.5rem;
    height: 1.5rem;
}

@media screen and (max-width: 600px) {
    .chat-options-button {
        display: none;
    }
}
</style>
