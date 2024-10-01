<script setup lang="ts">
import { defineProps } from 'vue';
import useKeywords from '@/context/keywords';
import { getUILanguage, l } from '@/locales';
import { ChatMessage, ChatMessageType } from '@/models/chat';

const props = defineProps<{
    message: ChatMessage;
}>();

const keywordTranslation = (k: string) => {
    const lang = getUILanguage();
    return useKeywords().getTranslation(k, lang) ?? k;
}
</script>

<template>
    <div class="chat-notification" v-if="props.message.type == ChatMessageType.Keyword && props.message.content">
        {{ $t(l.notification_keyword, { keyword: keywordTranslation(props.message.content) }) }}
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
</style>