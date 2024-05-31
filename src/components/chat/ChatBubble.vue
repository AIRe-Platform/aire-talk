<script setup lang="ts">
import { ChatMessage } from '@/models/chat';
import { defineProps, reactive, ref } from 'vue';
import { Chat, addViewCounterToContent, revertToMessage } from '@/context/chat';
import { l } from '@/locales';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import ChatBubbleOptions from './ChatBubbleOptions.vue'
import ChatBubbleModal from './ChatBubbleModal.vue';
import { Content, ContentType } from 'aire';
import Panel from "@/components/Panel.vue";

const props = defineProps<{ message: ChatMessage, can_revert: boolean, selectedContent?: Content[] }>()
const isSystem = props.message.role === "system";
const isBot = props.message.role === "assistant";

const state = reactive<{
    busy: boolean,
    selectedContent?: Content,
}>({
    busy: false,
    selectedContent: undefined,

});
const revertConfirmPopupOpen = ref(false);
const modalOpen = ref(false);

const toggleModal = () => {
    modalOpen.value = !modalOpen.value;
};

const onRevert = () => {
    revertToMessage(props.message.id)
};

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

const selectContent = (content: Content) => {
    state.selectedContent = content;
    if (content.url && (content.type == ContentType.Document || content.type == ContentType.URL)) {
        openContentInNewTab(content);
    } else
        toggleModal();
};

const openContentInNewTab = (content: Content) => {
    window.open(content.url, '_blank');
    addViewCounterToContent(content);
};

const closeModal = () => {
    state.selectedContent = undefined;
    toggleModal();
};
</script>

<template>
    <div :id="props.message.id" :class=classList @click="toggleModal">
        <ChatBubbleModal :active="modalOpen" :parent="props.message" :selectedContent="state.selectedContent"
            :onClose="closeModal" v-if="state.selectedContent != undefined" />
        <ChatBubbleOptions :parent="props.message" :can_revert="props.can_revert"
            v-if="props.message.role === 'assistant' && !message.content" />
        <div class="chat-bubble-content">
            <span class="chat-user-label">{{
        (isSystem || isBot) ? $t(message.sender) : message.sender
    }}</span>
            <span class="chat-message-text">
                {{
            isSystem
                ? (message.message === l.system_topic && Chat.current.topic
                    ? ($t(message.message!) + $t(Chat.current.topic.localization_key))
                    : $t(message.message!))
                : message.message
        }}
            </span>
            <Panel class="content-panel" v-if="message.content">
                <div class="content-container" v-for="content in message.content" @click.stop="selectContent(content)">
                    <ChatBubbleOptions :parent="message" :can_revert="false" :is_content="true" :content="content" />
                    <div class="header-row">
                        <p v-if="content.modified">{{ new Date(content.modified).toLocaleString($i18n.locale) }}</p>
                        <div class="icon content-image" v-if="content && content.type == ContentType.Image">
                        </div>
                        <div class="icon content-video" v-if="content && content.type == ContentType.Video">
                        </div>
                        <div class="icon content-url" v-if="content && content.type == ContentType.URL">
                        </div>
                        <div class="icon content-document" v-if="content && content.type == ContentType.Document">
                        </div>
                    </div>
                    <div class="chat-message-content" v-if="content?.type == ContentType.Image">
                        <img v-bind:src="content.url" class="chat-message-image-contain">
                    </div>
                    <div class="chat-message-content" v-if="content?.type == ContentType.URL">
                        <div class="chat-message-document-container" v-if="content.url">
                            <!-- @click="openDocument(content.url)"> -->
                            <font-awesome-icon icon="fa-solid fa-link" class="icon-link" />
                        </div>
                    </div>
                    <div class="chat-message-content" v-if="content?.type == ContentType.Video">
                        <video class="chat-message-video-video">
                            <source v-bind:src="content.url" type="video/mp4">
                        </video>
                    </div>
                    <div class="chat-message-content" v-if="content?.type == ContentType.Document">
                        <div class="chat-message-document-container" v-if="content.url">
                            <!-- @click="openDocument(content.url)"> -->
                            <div class="icon document"></div>
                        </div>
                    </div>
                    <div class="footer-row">
                        <p> {{ content.name }}</p>
                    </div>
                </div>
            </Panel>
        </div>
        <ConfirmDialog :accept="onRevert" :decline="() => { revertConfirmPopupOpen = false }"
            v-if="revertConfirmPopupOpen">
            {{ $t(l.popup_confirm_revert_message) }}
        </ConfirmDialog>
    </div>
</template>

<style lang="scss" scoped>
.chat-bubble {
    display: block;
    padding: 0.5rem 1rem;
    margin-right: 1rem;
    margin-left: 1rem;
    line-height: 1.4rem;
    /* background-color: var(--chat-bubble-background-color); */
    line-height: 1.4rem;
    border-radius: 1rem;
    border: 2px solid var(--box-stroke);
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

.content-panel {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    max-width: 36rem;
    width: fit-content;
}

.content-container {
    background-color: var(--panel-background-color);
    display: flex;
    flex-direction: column;
    min-width: 16rem;
    margin: 1rem;
    border-radius: 1rem;
    justify-content: center;
}

.header-row {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
}

.chat-message-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.chat-message-image {
    display: flex;
    justify-content: center;
}

.chat-message-url {
    display: flex;
    align-items: center;
}

.margin-left {
    margin-left: 1rem;
}

.chat-message-video {
    display: flex;
    justify-content: center;
}

.chat-message-document {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.chat-message-document-container {
    background-color: var(--chat-document-back-ground);
    width: 14rem;
    height: 8rem;
    border-radius: 1rem;
    border-width: 1rem;
    display: flex;
    flex-direction: column;
    align-content: center;
    align-items: center;
    justify-content: center;
    border: 2px solid var(--box-stroke);
}

.chat-message-video-video {
    border-radius: 1rem;
    width: 14rem;
    height: 8rem;
}

.chat-message-image-contain {
    height: 8rem;
    width: 14rem;
    object-fit: cover;

    border-radius: 1rem;
}

.chat-message-question {
    font-weight: bold;
    padding: 1rem;
}

.icon-link {
    width: 5rem;
    height: 6rem;
    color: var(--link-icon);
}

.footer-row {
    display: flex;
    margin-left: 1rem;
    justify-content: flex-start;
    max-width: 13rem;
    overflow: scroll;
    max-height: 4rem;
}

@media screen and ((max-aspect-ratio: 1/1) or (max-width: 920px)) {
    .ui-mode-mobile {
        .chat-bubble {
            max-width: unset;
            margin: 0.5rem 1rem 0.5rem 0.3rem
        }

        .chat-message-question {
            padding: 0;
        }

        .chat-message-video-video {
            max-width: 17rem;
            max-height: 12rem;
        }

        .chat-bubble-content {
            font-size: var(--font-small);
        }
    }
}
</style>