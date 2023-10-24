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
        <input id="chat-input-field" type="text" autofocus autocomplete="off" :readonly=Chat.state.awaitingResponse />
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
    box-shadow: 0 0 5px gray;
}

#chat-input-field {
    flex-grow: 1;
    border: 1px solid lightgray;
    border-radius: 0.5rem;
    padding: 0.2rem 0.6rem;
}
</style>