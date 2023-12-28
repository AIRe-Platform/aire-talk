<script setup lang="ts">
import { Chat } from '@/context/chat'
import { l } from '@/locales';
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
    <div class="chat-input-wrapper">
        <div class="chat-input-title"> {{ $t(l.chat_input_title) }} </div>
        <form class="chat-input-bar" @submit.prevent="submit">
            <input id="message-input" class="chat-input-field" type="text" autofocus autocomplete="off" :readonly=Chat.awaitingResponse />
        </form>
    </div> 
</template>

<style scoped>
.chat-input-wrapper{
    margin: auto;
    width: 50%;
    border-radius: 10px;
    box-shadow: 0 0 5px var(--shadow-color);
    margin-top: 1rem;
    padding: 1rem;
}
.chat-input-title{

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
</style>