<script setup lang="ts">
import { Chat } from '@/context/chat'
import { l } from '@/locales';

function submit(event: Event) {
    const form = event.target as HTMLFormElement;
    const el = form.firstChild as HTMLInputElement;
    const prompt = el.value.trim()

    if (prompt.length > 0)
        Chat.send(el.value)

    el.value = ""
}
</script>

<template>
    <div class="chat-input-wrapper">
        <div class="chat-input-image-container">
            <img class="chat-input-image" src="@/assets/logos/AIRE-Platform-Logo-2-teal.png" alt="Logo">
        </div>
        <div class="chat-input-title"> {{ $t(l.chat_input_title) }} </div>
        <form class="chat-input-bar" @submit.prevent="submit">
            <input id="message-input" class="chat-input-field" type="text" autofocus autocomplete="off"
                :readonly=Chat.awaitingResponse />
        </form>
    </div>
</template>

<style scoped>
.chat-input-wrapper {
    margin: auto;
    width: 49%;
    border-radius: 10px;
    box-shadow: 0 0 5px var(--shadow-color);
    margin-top: 1rem;
    padding: 1rem;
    position: absolute;
    bottom: 1rem;
    right: 25.3%;
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

.chat-input-image-container {
    position: relative;
}

.chat-input-image {
    position: absolute;
    height: 6rem;
    bottom: -1rem;
    left: 45%;
}

/* mobile*/
@media screen and (max-width: 600px) {
    .chat-input-wrapper {
        width: 91%;
        margin-bottom: 0rem;
        left: 0;
        bottom: 0;
    }

    .chat-input-image {
        bottom: -1.5rem;
        left: 8rem;
        transform: scale(0.7);
    }
}
</style>