<script setup lang="ts">
import { computed, defineProps } from 'vue';
import useKeywords from '@/context/keywords';
import { getUILanguage, l } from '@/locales';
import { ChatMessage, ChatMessageType } from '@/models/chat';

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
</script>

<template>
    <div class="chat-notification" v-if="props.message.type == ChatMessageType.Keyword && props.message.content">
        {{ $t(l.notification_keyword, { keyword: content }) }}
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