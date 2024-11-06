<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->

<script setup lang="ts">
import { defineProps, defineEmits, computed, reactive } from "vue";
import { router } from "@/router";
import Tooltip from "@/components/common/Tooltip.vue";
import useChat from "@/context/chat";
import useChatbot from "@/context/chatbot";
import { getChatContentIds } from "@/helpers/contentUtils";
import { conversationEnded } from "@/helpers/chatUtils";
import useTTS from "@/helpers/textToSpeech";
import { UISettings } from "@/context/ui";
import useSTT from "@/helpers/speechToText";
import { l } from "@/locales";

const props = defineProps<{
    optionsOpen: boolean,
    optionsVisible: boolean,
}>()

const state = reactive<{
    input: string,
    speechTimeout?: number,
    speechEnabled: boolean,
}>({
    input: "",
    speechEnabled: false,
})

const chat = useChat();
const bot = useChatbot();

defineEmits<{
    toggleOptions: []
}>()

function submit() {
    const prompt = state.input.trim();
    if (prompt.length > 0)
        chat.send(prompt);
    state.input = "";
}

const ended = computed(() => {
    return conversationEnded(chat.messages);
})

const stt = useSTT();
const sttCallback = (result: string) => {
    if (state.input.length > 0) {
        state.input += " ";
        result = result.slice(0, 1).toLocaleLowerCase() + result.slice(1);
    }
    state.input += result;

    if (state.speechTimeout)
        clearTimeout(state.speechTimeout);

    state.speechTimeout = setTimeout(() => {
        submit();
        state.speechTimeout = undefined;
    }, 5000);
}
const toggleListening = () => {
    if (state.speechTimeout)
        clearTimeout(state.speechTimeout);

    if (stt.isListening.value)
        stt.stop();
    else
        stt.listen(sttCallback);
}

const tts = useTTS();
const toggleTTS = () => {
    UISettings.ttsEnabled = !UISettings.ttsEnabled;
}
</script>

<template v-if="props.visible">
    <div class="chat-input" v-if="!ended">
        <div class="chat-bot" :class="{
            'chat-bot-busy': bot.status === 'writing',
            'chat-bot-finish': bot.status === 'answered'
        }">
        </div>
        <div class="chat-input-header">
            <div class="chat-bot-text">{{ $t(l.chat_input_title) }}</div>
            <div class="chat-content" v-if="getChatContentIds(chat.messages).length > 0" tabindex="0" role="link"
                @keydown.prevent.space.enter="() => router.push('/content-catalogue')"
                @click="() => router.push('/content-catalogue')">
                <Tooltip :text="$t(l.tooltip_open_catalogue_content)" position="left" :useMaxContent="true"
                    :adjustPosition="true">
                    <div class="icon chatbox-content-default">
                    </div>
                </Tooltip>
            </div>
            <div v-if="props.optionsVisible" class="chat-options-button"
                :class="{ 'chat-options-button-active': props.optionsOpen }" role="button"
                @keydown.prevent.space.enter="$emit('toggleOptions')" @click="$emit('toggleOptions')" tabindex="0">
                <Tooltip :text="$t(l.tooltip_open_chat_side_panel)" position="left" :useMaxContent="true"
                    :adjustPosition="true">
                    <div class="icon summary-switch-default"></div>
                </Tooltip>
            </div>
        </div>
        <div class="chat-text-input">
            <form class="chat-input-bar" @submit.prevent="submit">
                <input id="message-input" class="chat-input-field" type="text" autofocus autocomplete="off"
                    :readonly="bot.status === 'writing'" v-model="state.input" aria-label="Message input for the bot" />
            </form>
            <div class="chat-speech-button" @click="toggleListening" v-if="stt.isSupported.value">
                <font-awesome-icon icon="fa-solid fa-microphone-slash" v-if="stt.isListening.value" />
                <font-awesome-icon icon="fa-solid fa-microphone" v-else />
            </div>
            <div class="chat-tts-button" @click="toggleTTS" v-if="tts.isSupported.value">
                <font-awesome-icon icon="fa-solid fa-volume-xmark" v-if="UISettings.ttsEnabled" />
                <font-awesome-icon icon="fa-solid fa-volume-high" v-else />
            </div>
            <div class="chat-send-button" @click="submit">
                <Tooltip :text="$t(l.tooltip_send_message)" position="bottom" :useMaxContent="true"
                    :adjustPosition="true">
                    <div class="chat-send-icon icon send-message-default">
                    </div>
                </Tooltip>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.chat-input {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    border-radius: 1rem 1rem 0 0;
    box-shadow: 0 0 5px var(--box-stroke);
    margin: 0 5px 0 5px;
    padding: 1rem;
    background-color: var(--panel-background-color);
    z-index: 2;
    position: relative;
}

.chat-text-input {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    align-items: center;
}

.chat-input-header {
    display: flex;
    justify-content: space-between;
    position: relative;
    align-items: center;
}

.chat-input-bar {
    display: flex;
    flex-shrink: 0;
    flex-grow: 1;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    height: 2rem;
}

.chat-input-field {
    flex-grow: 1;
    color: black;
}

.chat-bot {
    width: 6rem;
    top: 2rem;
    right: 45%;
    height: 6rem;
    margin-top: -4.6rem;
    overflow: hidden;
    position: absolute;
    background-image: url("@/assets/images/aire-bot.png");
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
}

.chat-bot-busy {
    background-image: url("@/assets/images/aire-bot-thinking.gif");
}

.chat-bot-finish {
    background-image: url("@/assets/images/aire-bot-thinking-finish.png");
}

.chat-bot-text {
    border-radius: 0.5rem;
}

.chat-content {
    margin-left: auto;
}

.chat-content .icon {
    width: 2rem;
    height: 2rem;
}

.chat-options-button,
.chat-send-button,
.chat-speech-button,
.chat-tts-button {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: color .25s;
    padding: 0.2rem;
    color: var(--button-color);
    width: 2rem;

    &:hover {
        color: var(--accent-primary-color);
    }
}

.chat-options-button-active {
    color: var(--accent-primary-color);
}

.chat-options-icon svg {
    width: 1.5rem;
    height: 1.5rem;
}

.chat-send-icon {
    width: 2rem;
    height: 2rem;
}

@media screen and ((max-aspect-ratio: 1/1) or (max-width: 920px)) {

    .chat-options-button,
    .chat-content {
        position: relative;
        right: -1rem;
        top: -0.5rem;
    }

    .chat-bot {
        height: 6rem;
        top: 1rem;
        right: 45%;
    }
}


@media screen and ((max-aspect-ratio: 1/1) or (max-width: 920px)) {

    .chat-options-button,
    .chat-content {
        position: relative;
        right: -1rem;
        top: -0.7rem;
    }

    .chat-bot {
        height: 4rem;
        top: 2rem;
        right: 36%;
    }
}
</style>
