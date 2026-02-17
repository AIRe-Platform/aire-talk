<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->

<script setup lang="ts">
import { ChatMessage } from '@/models/chat';
import ChatItemOptions from '@/components/chat/ChatItemOptions.vue';
import VueMarkdown from 'vue-markdown-render';
import useTTS from '@/helpers/textToSpeech';
import { l } from '@/locales';
import Tooltip from '@/components/common/Tooltip.vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { getAgentLocalized } from '@/helpers/agentUtils';

const props = defineProps<{
    message: ChatMessage;
    canRevert?: boolean;
}>();

const i18n = useI18n();
const tts = useTTS();

const onTTS = () => {
    if (tts.isSpeaking.value)
        tts.stop();
    else
        tts.speak(props.message.content || "");
}

const sender = computed(() => {
    if (props.message.role === 'assistant') {
        if (props.message.agent) {
            const label = getAgentLocalized(props.message.agent, i18n.locale.value);
            if (label)
                return label;
        }

        return i18n.t(props.message.sender);
    }
    else {
        return props.message.sender;
    }
});
</script>

<template>
    <div :id="props.message.id" :class="{
        'chat-bubble': true,
        'chat-bubble-user': props.message.role === 'user',
        'chat-bubble-assistant': props.message.role === 'assistant',
        'chat-bubble-system': props.message.role === 'system'
    }">
        <ChatItemOptions :parent="props.message" :can_revert="props.canRevert"
            v-if="props.message.role === 'assistant'" />
        <div class="chat-bubble-content">
            <h2 class="chat-bubble-user-label" v-if="props.message.role !== 'system'">
                {{ sender }}
            </h2>
            <span class="chat-bubble-text" v-if="message.content">
                <template v-if="message.localize">{{ $t(message.content) }}</template>
                <VueMarkdown :source="message.content" v-else />
            </span>
            <span class="chat-bubble-buttons" v-if="props.message.role === 'assistant'">
                <Tooltip :text="tts.isSpeaking.value
                    ? $t(l.tooltip_chat_tts_stop_reading)
                    : $t(l.tooltip_chat_tts_read_message)" position="top-left" :useMaxContent="true"
                    :adjustPosition="true" v-if="tts.isSupported.value && props.message.content">
                    <button class="chat-bubble-button" @click="onTTS" type="button"
                        :aria-label="tts.isSpeaking.value ? $t(l.screen_recorder_stop_text_to_speech) : $t(l.screen_recorder_play_text_to_speech)">
                        <font-awesome-icon icon="fa-solid fa-volume-xmark" v-if="tts.isSpeaking.value" />
                        <font-awesome-icon icon="fa-solid fa-volume-high" v-else />
                    </button>
                </Tooltip>
            </span>
        </div>
    </div>
</template>

<style scoped lang="scss">
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
    width: 100%;
}

.chat-bubble-assistant {
    align-self: flex-end;
    height: fit-content;
    width: 100%;
    background-color: var(--ia-chat-box-background);
}

.chat-bubble-system {
    align-self: center;
    max-width: 80%;
    margin-left: 3rem;
    background-color: var(--ia-chat-box-background);
}

.chat-bubble-content {
    display: flex;
    flex-direction: column;
    font-size: var(--font-medium);
    width: 100%;
    gap: 0.2rem;
}

.chat-bubble-buttons {
    display: flex;
    flex-direction: row;
    justify-content: end;
}

.chat-bubble-user-label {
    font-size: var(--font-medium);
    font-weight: bold;
    margin-block-end: 0;
}

.chat-bubble-assistant .chat-bubble-user-label {
    color: var(--chat-bubble-bot-label);
}

.chat-bubble-user .chat-bubble-user-label {
    color: var(--chat-user-label);
}

.chat-bubble-button {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: color .25s;
    padding: 0.2rem;
    color: var(--button-color);
    border: none;
    background-color: transparent;
    width: 2rem;

    &:hover {
        color: var(--hover-text);
    }
}

.theme-dark .chat-bubble-button {
    color: #FFF;
}

.chat-bubble-user .chat-bubble-content {
    align-items: flex-end;
}

@media screen and ((max-aspect-ratio: 1/1) or (max-width: 920px)) {
    .chat-bubble {
        margin: 0.5rem 1rem 0.5rem 0.3rem
    }
}
</style>