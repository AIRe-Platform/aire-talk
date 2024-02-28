<script setup lang="ts">
import { Chat, sendChatMessage } from "@/context/chat";
import { l } from "@/locales";

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
    justify-content: flex-start;
    height: 6rem;
    margin-top: -4.8rem;
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
</style>
