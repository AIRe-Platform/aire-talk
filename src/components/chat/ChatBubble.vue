<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->

<script setup lang="ts">
import { ChatMessage } from '@/models/chat';
import { defineProps, onMounted, reactive } from 'vue';
import useChat from '@/context/chat';
import { l } from '@/locales';
import { AireContent, AireContentType } from 'aire';

import useContent from '@/context/content';
import DialogModal from '@/components/layout/DialogModal.vue';
import ChatBubbleOptions from '@/components/chat/ChatBubbleOptions.vue'
import ChatContent from '@/components/chat/ChatContent.vue';
import Panel from "@/components/common/Panel.vue";
import ContentModal from '../content/ContentModal.vue';

const contentContext = useContent();
const chat = useChat();
const props = defineProps<{ message: ChatMessage, can_revert: boolean }>();
const isSystem = props.message.role === "system";
const isBot = props.message.role === "assistant";

const state = reactive<{
    content: AireContent[],
    openContent?: AireContent,
    modalOpen: boolean,
    revertConfirm: boolean,
}>({
    content: [],
    modalOpen: false,
    revertConfirm: false,
})

let classList: any[] = ["chat-bubble"]
switch (props.message.role) {
    case "assistant": classList.push("chat-bubble-bot"); break;
    case "user": classList.push("chat-bubble-user"); break;
    case "system":
        classList.push("chat-bubble-system");
        break;
}
if (props.message.isError)
    classList.push("chat-bubble-error");

const toggleModal = () => {
    state.modalOpen = !state.modalOpen;
};

const onRevert = () => {
    chat.revertTo(props.message.id)
};

const showContent = async (content: AireContent) => {
    state.openContent = content;
    switch (content.type) {
        case AireContentType.Image:
        case AireContentType.Video:
            toggleModal();
            break;
        default:
            {
                const url = content.id ? await contentContext.getUrl(content.id) : content.url;
                if (url) {
                    window.open(url, '_blank');
                }
            }
    }

    if (content.id)
        contentContext.addViewCount(content.id);

};

const closeModal = () => {
    state.openContent = undefined;
    toggleModal();
};

const listContent = async () => {
    state.content = [];
    props.message.media?.forEach(async (x) => {
        const item = await contentContext.get(x);
        if (item)
            state.content.push(item);
    })
}

onMounted(() => {
    listContent()
})
</script>

<template>
    <div :id="props.message.id" :class="[...classList, { 'is-suggestion': props.message.suggestion }]"
        @click="toggleModal">
        <ChatBubbleOptions :parent="props.message" :can_revert="props.can_revert"
            v-if="props.message.role === 'assistant'" />
        <div class="chat-bubble-content">
            <span class="chat-user-label">
                {{ (isSystem || isBot) ? $t(message.sender) : message.sender }}
            </span>
            <span class="chat-message-text">
                {{ message.content }}
            </span>
            <Panel class="chat-content-panel" v-if="message.media">
                <ChatContent v-for="id in message.media" :contentId="id" :key="id" :parent="props.message"
                    @show="showContent" />
            </Panel>
        </div>
        <ContentModal :active="state.openContent !== undefined && state.modalOpen" :parent="props.message"
            :content="state.openContent" :onClose="closeModal" />
        <DialogModal :active="state.revertConfirm" :buttons="[
        { loc_key: l.button_accept },
        { loc_key: l.button_cancel },
    ]" @select="(i: number) => {
        switch (i) {
            case 0:
                onRevert();
                break;
            default:
            case 1:
                state.revertConfirm = false;
                break;
        }
    }" :accept="onRevert" :decline="() => { }">
            {{ $t(l.popup_confirm_revert_message) }}
        </DialogModal>
    </div>
</template>

<style lang="scss" scoped>
.chat-bubble {
    display: block;
    line-height: 1.4rem;
    padding: 0.5rem 1rem;
    margin: 1rem 1.5rem;

    border: 2px solid var(--box-stroke);
    border-radius: 1rem;

    max-width: calc(100% - 2rem - 3rem - 4px); // Removed padding, margin, border
}

.chat-bubble-user {
    align-self: flex-start;
    background-color: var(--user-chat-box-background);
}

.chat-bubble-bot {
    align-self: flex-end;
    height: fit-content;
    background-color: var(--ia-chat-box-background);
}

.chat-bubble-system {
    align-self: center;
    max-width: 80%;
    margin-left: 3rem;
    background-color: var(--ia-chat-box-background);
}

.chat-bubble-error {
    border-color: var(--error-color);
}

.chat-bubble-content {
    display: flex;
    flex-direction: column;
    font-size: var(--font-medium);
    width: 100%;
}

.chat-user-label {
    font-size: var(--font-medium);
    font-weight: bold;
}

.chat-bubble-bot .chat-user-label {
    color: var(--chat-bubble-bot-label);
}

.chat-bubble-user .chat-user-label {
    color: var(--accent-primary-color);
}

.chat-message-text {
    white-space: pre-line;
}

.chat-content-panel {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: space-around;
    gap: 1rem;
    padding: 1rem;
    margin: 0;
    margin-top: 1rem;
}

.is-suggestion {
    background-color: var(--suggestions-background);
}

@media screen and ((max-aspect-ratio: 1/1) or (max-width: 920px)) {
    .chat-bubble {
        margin: 0.5rem 1rem 0.5rem 0.3rem
    }

    .chat-bubble-content {
        font-size: var(--font-small);
    }
}
</style>