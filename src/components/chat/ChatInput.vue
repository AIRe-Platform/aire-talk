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
import { ChatTutorialState } from "@/context/tutorials";

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
    if (stt.isListening.value)
        stt.stop();

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
    }, 8000);
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
        <div class="chat-bot" :data-tutorial-state="ChatTutorialState.Welcome" :class="{
            'chat-bot-busy': bot.status === 'writing',
            'chat-bot-finish': bot.status === 'answered'
        }"> <img v-if="bot.status === 'writing'" src="@/assets/images/aire-bot-thinking.gif"
                :alt=$t(l.chat_input_alternative_alternative_image_logo_thinking) aria-hidden="true"
                style="visibility: hidden; width: 0; height: 0;">
            <img v-else-if="bot.status === 'answered'" src="@/assets/images/aire-bot-thinking-finish.png"
                :alt=$t(l.chat_input_alternative_alternative_image_logo_finish) aria-hidden="true"
                style="visibility: hidden; width: 0; height: 0;">
            <img v-else src="@/assets/images/aire-bot.png"
                :alt=$t(l.chat_input_alternative_alternative_image_logo_idle_state) aria-hidden="true"
                style="visibility: hidden; width: 0; height: 0;">
            <div v-if="bot.status === 'writing'" aria-live="assertive" class="screen-readers-only" role="alert"
                tabindex="-1" ref="statusAlert">
                {{ $t(l.screen_recorder_bot_writing) }}
            </div>

            <div v-else-if="bot.status === 'answered'" aria-live="polite" class="screen-readers-only" role="alert"
                tabindex="-1" ref="statusAlert">
                {{ $t(l.screen_recorder_bot_stop_writing) }}
            </div>

        </div>
        <div class="chat-input-left">
            <label for="message-input" class="chat-bot-text" role="text" aria-live="polite"
                :aria-label="$t(l.chat_input_title)" tabindex="0">
                {{ $t(l.chat_input_title) }}
            </label>
            <form class="chat-input-bar" @submit.prevent="submit">
                <input id="message-input" class="chat-input-field" type="text" autofocus autocomplete="off"
                    :data-tutorial-state="ChatTutorialState.Input" :readonly="bot.status === 'writing'"
                    v-model="state.input" :aria-label="$t(l.screen_recorder_chat_input_description)" />
            </form>
        </div>
        <div class="chat-text-right">
            <div class="chat-tts">
                <div class="chat-tts-top">
                    <div class="chat-content" v-if="getChatContentIds(chat.messages).length > 0" tabindex="0"
                        role="link" @keydown.prevent.space.enter="() => router.push('/content-catalogue')"
                        @click="() => router.push('/content-catalogue')">
                        <Tooltip :text="$t(l.tooltip_open_catalogue_content)" position="left" :useMaxContent="true"
                            :adjustPosition="true">
                            <div class="icon chatbox-content-default"></div>
                        </Tooltip>
                    </div>
                </div>
                <div class="chat-tts-buttom">
                    <template v-if="stt.isSupported.value">
                        <Tooltip :text="stt.isListening.value
                            ? $t(l.tooltip_chat_speech_recognition_off)
                            : $t(l.tooltip_chat_speech_recognition_on)" position="top-left" :useMaxContent="true"
                            :adjustPosition="true">
                            <button class="chat-speech-button" @click="toggleListening" type="button" :aria-label="stt.isListening.value
                                ? $t(l.tooltip_chat_speech_recognition_off)
                                : $t(l.tooltip_chat_speech_recognition_on)">
                                <div v-if="stt.isListening.value" class="icon voice-control-stop"></div>
                                <div v-else class="icon voice-control"></div>
                            </button>
                        </Tooltip>
                    </template>
                    <template v-if="tts.isSupported.value">
                        <Tooltip :text="UISettings.ttsEnabled
                            ? $t(l.tooltip_chat_tts_read_new_messages_off)
                            : $t(l.tooltip_chat_tts_read_new_messages_on)" position="top-left" :useMaxContent="true"
                            :adjustPosition="true">
                            <button class="chat-tts-button" @click="toggleTTS" type="button" :aria-label="UISettings.ttsEnabled
                                ? $t(l.tooltip_chat_tts_read_new_messages_off)
                                : $t(l.tooltip_chat_tts_read_new_messages_on)">
                                <font-awesome-icon icon="fa-solid fa-volume-xmark" class="fa-volume-input"
                                    v-if="UISettings.ttsEnabled" />
                                <font-awesome-icon icon="fa-solid fa-volume-high" class="fa-volume-input" v-else />
                            </button>
                        </Tooltip>
                    </template>
                </div>
            </div>
            <div class="chat-options">
                <button v-if="props.optionsVisible" class="chat-options-button"
                    :class="{ 'chat-options-button-active': props.optionsOpen }" type="button"
                    :data-tutorial-state="ChatTutorialState.Sidepanel" @click="$emit('toggleOptions')" :aria-label="props.optionsOpen
                        ? $t(l.screen_recorder_close_chat_side_panel)
                        : $t(l.screen_recorder_open_chat_side_panel)">
                    <Tooltip :text="$t(l.tooltip_open_chat_side_panel)" position="bottom" :useMaxContent="false"
                        :adjustPosition="true">
                        <div class="icon summary-switch-default"></div>
                    </Tooltip>
                </button>
                <button class="chat-send-button" @click="submit" type="button" :aria-label=$t(l.tooltip_send_message)>
                    <Tooltip :text="$t(l.tooltip_send_message)" position="bottom" :useMaxContent="true"
                        :adjustPosition="true">
                        <div class="chat-send-icon icon send-message-default"></div>
                    </Tooltip>
                </button>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.chat-input {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    border-radius: 1rem 1rem 0 0;
    box-shadow: 0 0 5px var(--box-stroke);
    margin: 0 5px 0 5px;
    padding: 1rem;
    background-color: var(--panel-background-color);
    z-index: 2;
    position: relative;
}

.chat-input-left {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
    align-items: flex-start;
    gap: 1rem;
    width: 91%;
}

.chat-text-right {
    display: flex;
    flex-direction: row;
    align-items: baseline;
    width: 8%;
    justify-content: space-between;
}

.chat-tts {
    display: flex;
    flex-direction: column;
    width: 70%;
    height: 100%;
}

.chat-tts-top {
    display: flex;
    height: 50%;
}

.chat-tts-buttom {
    display: flex;
    justify-content: flex-start;
    gap: 0.5rem;
    height: 50%;
}

.chat-options {
    display: flex;
    flex-direction: column;
}

.chat-input-bar {
    display: flex;
    flex-shrink: 0;
    flex-grow: 1;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    height: 2rem;
    width: 100%;
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
    border: none;
    background-color: transparent;

    &:hover {
        color: var(--hover-text);
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


.fa-volume-input {
    width: 1.5rem;
    height: 1.5rem;
    margin-bottom: 0.3rem;
}


@media screen and ((max-aspect-ratio: 1/1) or (max-width: 920px)) {

    .chat-options-button,
    .chat-content {
        position: relative;
        right: -1rem;
        top: -0.7rem;
    }

    .chat-send-button {
        position: relative;
        right: -1rem;
        top: 0.2rem;
    }

    .chat-bot {
        height: 4rem;
        top: 2rem;
        right: 36%;
    }

    .chat-input-left {
        width: 75%;
    }

    .chat-text-right {
        width: 30%;
    }

    .chat-tts {
        width: 50%;
    }

    .chat-tts-buttom {
        gap: 0rem;
    }

    .chat-options {
        width: 46%;
    }
}

@media screen and (max-height: 400px) and (orientation: landscape) {
    .chat-input-left {
        width: 100%;
    }

    .chat-text-right {
        width: 20%;
    }

    .chat-input-bar {
        max-height: 2rem;
    }

}
</style>
