<script setup lang="ts">
import { computed, defineProps } from 'vue';
import useKeywords from '@/context/keywords';
import { getUILanguage, l } from '@/locales';
import { ChatMessage, ChatMessageType } from '@/models/chat';
import useChat from '@/context/chat';

const props = defineProps<{
    message: ChatMessage;
}>();

const content = computed(() => {
    const lang = getUILanguage();
    if (props.message.content) {
        if (props.message.type == ChatMessageType.Keyword) {
            return useKeywords().getTranslation(props.message.content, lang) ?? props.message.content;
        }
    }
    return props.message.content;
});

const chat = useChat();
</script>

<template>
    <div class="chat-notification" v-if="props.message.type == ChatMessageType.Keyword && props.message.content">
        {{ $t(l.notification_keyword, { keyword: content }) }}
        <div class="button-keyword-delete" @click="chat.removeKeyword(props.message.content, true)">
            <font-awesome-icon icon="fa-solid fa-xmark" />
        </div>
    </div>
</template>

<style scoped>
.chat-notification {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: end;
    flex-grow: 1;
    font-size: var(--font-small);
    color: var(--title-text);
}

.button-keyword-delete {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    width: 2rem;
    transition: color .2s;
    color: #B6465F;
    font-size: large;

    &:hover {
        color: var(--accent-secondary-color);
    }
}
</style>