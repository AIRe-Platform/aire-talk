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
    <div class="chat-input-wrapper">
        <div class="chat-input-bot">
            <img
                class="chatbot-icon"
                src="@/assets/images/aire-logo-a.png"
                alt="Logo"
            />
        </div>
        <div class="chat-input-title">{{ $t(l.chat_input_title) }}</div>
        <form class="chat-input-bar" @submit.prevent="submit">
            <input
                id="message-input"
                class="chat-input-field"
                type="text"
                autofocus
                autocomplete="off"
                :readonly="Chat.awaitingResponse"
            />
        </form>
    </div>
</template>

<style scoped>
.chat-input-wrapper {
    border-radius: 1rem 1rem 0 0;
    box-shadow: 0 0 5px var(--shadow-color);
    margin: 1rem 5px 0 5px;
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

.chat-input-bot {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    height: 0;
    overflow: visible;
}

.chatbot-icon {
    display: block;
    height: 8rem;
    padding-bottom: 3rem;
    margin-right: 1rem;
}

@media screen and (max-width: 600px) {
    .chatbot-icon {
        display: block;
        height: 6rem;
        padding-bottom: 3rem;
        margin-right: 1rem;
    }
}
</style>
