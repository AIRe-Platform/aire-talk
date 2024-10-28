<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->


<script setup lang="ts">
import { computed, defineProps } from 'vue';
import { getUILanguage, l } from '@/locales';
import { ChatMessage, ChatMessageType } from '@/models/chat';
import useChat from '@/context/chat';
import { getKeywordTranslation } from '@/helpers/keywordUtils';
import { adjustTooltipPosition } from '@/helpers/tooltipUtils';

const props = defineProps<{
    message: ChatMessage;
}>();

const content = computed(() => {
    const lang = getUILanguage();
    if (props.message.content) {
        if (props.message.type == ChatMessageType.Keyword) {
            return getKeywordTranslation(props.message.content, lang) ?? props.message.content;
        }
    }
    return props.message.content;
});

const chat = useChat();
</script>

<template>
    <div :id="props.message.id" class="chat-notification"
        v-if="props.message.type == ChatMessageType.Keyword && props.message.content">
        {{ $t(l.notification_keyword, { keyword: content }) }}
        <div class="button-keyword-delete tooltip"
            @mouseenter="adjustTooltipPosition($event, false)"
            tabindex="0"
            role="button"
            @keypress.prevent.space.enter="chat.removeKeyword(props.message.content, true)"
            @click="chat.removeKeyword(props.message.content, true)">
            <span class="tooltiptext">{{ $t(l.tooltip_remove_keyword) }}</span>
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