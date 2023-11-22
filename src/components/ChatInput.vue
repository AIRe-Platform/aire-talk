<script setup lang="ts">
import Chat from '@/context/chat'
function submit(event: Event)
{
    const form = event.target as HTMLFormElement;
    const el = form.firstChild as HTMLInputElement;
    const prompt = el.value.trim()

    if(prompt.length > 0)
        Chat.send(el.value)
    
    el.value = "" 
}
</script>

<template>
    <form class="chat-input-bar" @submit.prevent="submit">
        <input id="message-input" class="chat-input-field" type="text" autofocus autocomplete="off" :readonly=Chat.state.awaitingResponse />
    </form>
</template>

<style scoped>
.chat-input-bar {
    display: flex;
    flex-shrink: 0;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    padding: 0.5rem;
    height: 2rem;
    box-shadow: 0 0 5px var(--shadow-color);
}

.chat-input-field {
    flex-grow: 1;
}
</style>