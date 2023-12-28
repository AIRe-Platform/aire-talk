<script setup lang="ts">
import { defineComponent } from 'vue';
import { Chat } from '@/context/chat';
import { BurgerMenuState } from '@/context/burgerMenuState';
import ChatBubble from '@/components/ChatBubble.vue'
import ChatInput from '@/components/ChatInput.vue'
import { l } from '@/locales';
import burgerMenu from './burgerMenu.vue';
defineComponent({ name: "ChatView" })
</script>

<template>
    <burger-menu></burger-menu>

    <div v-bind:class = "( BurgerMenuState.isBurgerMenuOpen )?'add-opacity':'no-opacity'">
        <div class="chat-own-data" v-if="Chat.landingInfo.age != null || Chat.checkbox">
            {{ $t(l.chat_data) }} 
            <div class="chat-own-data-landing" v-if="Chat.landingInfo.age != null">
                {{ $t(l.chat_age) }} {{ Chat.landingInfo.age }}

                {{ $t(l.chat_occupation) }}  {{ Chat.landingInfo.occupation }}
            </div>
            <div class="chat-own-data-chexbox" v-if="Chat.checkbox">
                {{ $t(l.chat_topic) }} {{ Chat.checkbox.name }}
            </div>
        </div>
        <div class="chat-view">
            <div id="chat-view" class="chat-view-content">
                <template v-for="(msg) in Chat.history" v-bind:key="msg.timestamp">
                    <div class="chat-bubble-system" v-if="msg.role == 'system'">
                        <ChatBubble :message="msg" />
                    </div>
                    <div class="chat-bubble-assistant" v-if="msg.role == 'assistant'">
                        <ChatBubble :message="msg" />
                    </div>
                    <div class="chat-bubble-user" v-if="msg.role == 'user'">
                        <ChatBubble :message="msg" />
                    </div>
                </template>
            </div>
        </div>
        <ChatInput />
    </div>
</template>

<style scoped>
#chat-view {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding: 1rem;
    overflow: auto;
    background-color: var(--panel-background-color);
}
.chat-view-bubble-wrapper{
    display: flex;
    flex-direction: column;
    padding-left: 10rem;
    padding-right: 10rem;
}

.chat-bubble-system{
    display: flex;
    flex-direction: column;
}

.chat-bubble-assistant{
    margin-right: 40rem;
}

.chat-bubble-user{
    margin-left: 20rem;
}

.chat-view-content{
    margin: auto;
    width: 50%;
    border-radius: 10px;
    box-shadow: 0 0 5px var(--shadow-color);
}

.chat-own-data{
    
}
</style>
@/context/burgerMenu