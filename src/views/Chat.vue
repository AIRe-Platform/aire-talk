<script setup lang="ts">
import { defineComponent } from 'vue';
import { Chat } from '@/context/chat';
import ChatBubble from '@/components/ChatBubble.vue'
import ChatInput from '@/components/ChatInput.vue'
import { l } from '@/locales';
import Summary from './Summary.vue';
import { SummaryState } from '@/context/summaryState';
import { ChatMessage } from '@/models/chat';
defineComponent({ name: "ChatView" })

const canRevert = (msg: ChatMessage) => {
    const lastMessageId = Chat.history[Chat.history.length - 1].id
    return msg.id !== lastMessageId
};

</script>

<template>
    <div>
        <div class="chat-own-data" v-if="Chat.landingInfo.age != null || Chat.checkbox || Chat.onboardingFromExternalSite">
            {{ $t(l.chat_data) }}
            <div class="chat-own-data-landing" v-if="Chat.landingInfo.age != null">
                {{ $t(l.chat_age) }} {{ Chat.landingInfo.age }}

                {{ $t(l.chat_occupation) }} {{ Chat.landingInfo.occupation }}
            </div>
            <div class="chat-own-data-chexbox" v-if="Chat.checkbox">
                {{ $t(l.chat_topic) }} {{ Chat.checkbox.name }}
            </div>
            <div class="chat-own-data-onboarding" v-if="Chat.onboardingFromExternalSite">
                {{ $t(l.chat_topic_onboarding) }} {{ Chat.onboardingFromExternalSite.name }}
            </div>
        </div>
        <div class="chat-view-wrapper" v-bind:class="(SummaryState.isSummaryOpen) ? 'add-opacity' : 'no-opacity'">
            <div id="chat-view" class="chat-view-content">
                <template v-for="(msg) in Chat.history" v-bind:key="msg.id">
                    <ChatBubble :message="msg" :can_revert="canRevert(msg)" />
                </template>
            </div>
        </div>
        <ChatInput v-bind:class="(SummaryState.isSummaryOpen) ? 'add-opacity' : 'no-opacity'" />
        <Summary></Summary>
    </div>
</template>

<style scoped>
.chat-view-wrapper {
    margin-bottom: 7rem;
}

#chat-view {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding: 1rem;
    overflow: auto;
    background-color: var(--panel-background-color);
}

.chat-view-content {
    margin: auto;
    width: 50%;
    height: 90%;
}

.chat-own-data {
    margin-left: 64rem;
}

/* mobile*/
@media screen and (max-width: 600px) {
    .chat-view-wrapper {
        margin-bottom: 4rem;
    }

    #chat-view {
        padding-left: 0rem;
        padding-top: 1rem;
    }

    .chat-view-content {
        margin: auto;
        width: 100%;
        border-radius: 10px;
        box-shadow: 0 0 5px var(--shadow-color);
        padding: 0rem;
        padding-top: 1rem;
    }
}
</style>
