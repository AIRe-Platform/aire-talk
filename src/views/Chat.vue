<script setup lang="ts">
    import { defineComponent } from 'vue';
    import { Chat } from '@/context/chat';
    import ChatBubble from '@/components/ChatBubble.vue'
    import ChatInput from '@/components/ChatInput.vue'
    import { l } from '@/locales';
    import Summary from './Summary.vue';
    import { SummaryState } from '@/context/summaryState';
    defineComponent({ name: "ChatView" })
    
    /**
     * Save the current chat to the ddbb. takes the chat_id from Chat.chat_id
     */
    const newChat = (e?: Event) => {
        e?.preventDefault();
        
        console.log("creating a new chat ", Chat.newChat());
    };
</script>

<template>
    <div>
        <button class="chat-new-chat" @click="newChat">
            <a class="nav-link" href="#"> New chat </a>
        </button>
        <button class="load-test-messages" @click="() => Chat.loadTestMessages()">
            <a class="nav-link" href="#"> Test messages </a>
        </button>
        <div class="chat-own-data" v-if="Chat.landingInfo.age != null || Chat.checkbox || Chat.OnboardingFromExternalSite">
            {{ $t(l.chat_data) }} 
            <div class="chat-own-data-landing" v-if="Chat.landingInfo.age != null">
                {{ $t(l.chat_age) }} {{ Chat.landingInfo.age }}

                {{ $t(l.chat_occupation) }}  {{ Chat.landingInfo.occupation }}
            </div>
            <div class="chat-own-data-chexbox" v-if="Chat.checkbox">
                {{ $t(l.chat_topic) }} {{ Chat.checkbox.name }}
            </div>
            <div class="chat-own-data-onboarding" v-if="Chat.OnboardingFromExternalSite">
                {{ $t(l.chat_topic_onboarding) }} {{ Chat.OnboardingFromExternalSite.name }}
            </div>
        </div>
        <div
            class="chat-view-wrapper"
            v-bind:class = "( SummaryState.isSummaryOpen )?'add-opacity':'no-opacity'"
        >
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
        <ChatInput 
            v-bind:class = "( SummaryState.isSummaryOpen )?'add-opacity':'no-opacity'"
        />
        <Summary></Summary>
    </div>
</template>

<style scoped>
    .chat-new-chat{
        position: absolute;
        left: 10rem;
        top: 8rem;
    }
    .load-test-messages {
        position: absolute;
        left: 10rem;
        top: 10rem;
    }
    .chat-view-wrapper{
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
    .chat-bubble-system{
        display: flex;
        flex-direction: column;
    }
    .chat-bubble-assistant{
        display: flex;
        justify-content: flex-end;
        margin-bottom: 3rem;
    }
    .chat-bubble-user{
        display: flex;
        justify-content: flex-start;
    }
    .chat-view-content{
        margin: auto;
        width: 50%;
        height: 90%;
    }
    .chat-own-data{
        margin-left: 64rem;
    }

    /* mobile*/
    @media screen and (max-width: 600px) {
        .chat-view-wrapper{
            margin-bottom: 4rem;
        }
        #chat-view{
            padding-left: 0rem;
            padding-top: 1rem;
        }
        .chat-view-content{
            margin: auto;
            width: 100%;
            border-radius: 10px;
            box-shadow: 0 0 5px var(--shadow-color);
            padding: 0rem;
            padding-top: 1rem;
        }
        .chat-bubble-assistant{
            position: relative;
        }
        .chat-bubble-assistant{
            margin-bottom: -1rem;
        }
    }
</style>
