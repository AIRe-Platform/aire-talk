<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->

<script setup lang="ts">
import { computed, reactive } from "vue";
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
                :alt=$t(l.chat_input_alternative_image_logo_thinking) aria-hidden="true"
                style="visibility: hidden; width: 0; height: 0;">
            <img v-else-if="bot.status === 'answered'" src="@/assets/images/aire-bot-thinking-finish.png"
                :alt=$t(l.chat_input_alternative_image_logo_finish) aria-hidden="true"
                style="visibility: hidden; width: 0; height: 0;">
            <img v-else src="@/assets/images/aire-bot.png" :alt=$t(l.chat_input_alternative_image_logo_idle_state)
                aria-hidden="true" style="visibility: hidden; width: 0; height: 0;">
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
            <label for="message-input" class="chat-bot-text" aria-live="polite" :aria-label="$t(l.chat_input_title)"
                tabindex="0">
                {{ $t(l.chat_input_title) }}
            </label>
            <form class="chat-input-bar" @submit.prevent="submit">
                <input id="message-input" class="chat-input-field" type="text" autofocus autocomplete="off"
                    :data-tutorial-state="ChatTutorialState.Input" :readonly="bot.status === 'writing'"
                    v-model="state.input" :aria-label="$t(l.screen_recorder_chat_input_description)" />
            </form>
        </div>
        <div class="chat-input-right">
            <div class="chat-input-right-top">
                <template v-if="getChatContentIds(chat.messages).length > 0">
                    <Tooltip :text="$t(l.tooltip_open_catalogue_content)" position="top-left" :useMaxContent="true"
                        :adjustPosition="true">
                        <button class="chat-input-button" @keydown.space="() => router.push('/content-catalogue')"
                            @click="() => router.push('/content-catalogue')">
                            <div class="icon chatbox-content-default"></div>
                        </button>
                    </Tooltip>
                </template>
                <template v-if="tts.isSupported.value">
                    <Tooltip :text="UISettings.ttsEnabled
                        ? $t(l.tooltip_chat_tts_read_new_messages_off)
                        : $t(l.tooltip_chat_tts_read_new_messages_on)" position="top-left" :useMaxContent="true"
                        :adjustPosition="true">
                        <button class="chat-input-button" @click="toggleTTS" type="button" :aria-label="UISettings.ttsEnabled
                            ? $t(l.tooltip_chat_tts_read_new_messages_off)
                            : $t(l.tooltip_chat_tts_read_new_messages_on)">
                            <div class="icon-background">
                                <font-awesome-icon icon="fa-solid fa-volume-xmark" class="fa-volume-input"
                                    v-if="UISettings.ttsEnabled" />
                                <font-awesome-icon icon="fa-solid fa-volume-high" class="fa-volume-input" v-else />
                            </div>
                        </button>
                    </Tooltip>
                </template>
                <template v-if="props.optionsVisible">
                    <Tooltip :text="$t(l.tooltip_open_chat_side_panel)" position="top-left" :useMaxContent="false"
                        :adjustPosition="true">
                        <button class="chat-input-button" :class="{ 'chat-options-button-active': props.optionsOpen }"
                            type="button" :data-tutorial-state="ChatTutorialState.Sidepanel"
                            @click="$emit('toggleOptions')" :aria-label="props.optionsOpen
                                ? $t(l.screen_recorder_close_chat_side_panel)
                                : $t(l.screen_recorder_open_chat_side_panel)">
                            <div class="icon summary-switch-default"></div>
                        </button>
                    </Tooltip>
                </template>
            </div>
            <div class="chat-input-right-bottom">
                <template v-if="stt.isSupported.value">
                    <Tooltip :text="stt.isListening.value
                        ? $t(l.tooltip_chat_speech_recognition_off)
                        : $t(l.tooltip_chat_speech_recognition_on)" position="top-left" :useMaxContent="true"
                        :adjustPosition="true">
                        <button class="chat-input-button" @click="toggleListening" type="button" :aria-label="stt.isListening.value
                            ? $t(l.tooltip_chat_speech_recognition_off)
                            : $t(l.tooltip_chat_speech_recognition_on)">
                            <div v-if="stt.isListening.value" class="icon-background recording">
                                <div class="icon speech-to-text"></div>
                            </div>
                            <div v-else class="icon-background">
                                <div class="icon speech-to-text"></div>
                            </div>
                        </button>
                    </Tooltip>
                </template>
                <Tooltip :text="$t(l.tooltip_send_message)" position="top-left" :useMaxContent="true"
                    :adjustPosition="true">
                    <button class="chat-input-button" @click="submit" type="button"
                        :aria-label=$t(l.tooltip_send_message)>
                        <div class="icon send-message-default"></div>
                    </button>
                </Tooltip>
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
    background-color: var(--panel-background-color);
    z-index: 2;
    position: relative;
}

.chat-input-left {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: space-between;
    position: relative;
    align-items: flex-start;
    padding: 0.5rem;
    padding-right: 0;
}

.chat-input-right {
    display: flex;
    flex-direction: column;
    justify-content: end;
    padding: 0.5rem;
    padding-left: 0;
}

.chat-input-right-top {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 5px;
}

.chat-input-right-bottom {
    display: flex;
    flex-direction: row;
    justify-content: start;
    align-items: center;
    gap: 5px;
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
    display: block;
    width: calc(100% - 1.25rem);
    color: black;
    line-height: 2em;
    max-height: 2em;
}

.chat-bot {
    width: 6rem;
    top: 1.6rem;
    right: 50%;
    height: 6rem;
    transform: translateX(50%);
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
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-grow: 1;
    padding: 0.5rem;
}

.chat-input-button {
    margin: 0;
    padding: 0;
    width: 48px;
    height: 48px;

    display: flex;
    align-items: center;
    justify-content: center;
    border: 0;
    background-color: transparent;

    .icon {
        width: 100%;
        height: 100%;
        background-size: cover;
    }

    .icon-background {
        width: 38px;
        height: 38px;
        margin-bottom: 4px;

        display: flex;
        align-items: center;
        justify-content: center;
        background-color: var(--button-color);
        border-radius: 50%;
        overflow: hidden;

        svg,
        .speech-to-text {
            width: 75%;
            height: 75%;
            margin: 0;
        }
    }

    .recording {
        background-color: var(--accent-primary-color);
    }
}

.theme-dark .icon-background svg {
    color: #FFF;
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
    .chat-bot {
        height: 4rem;
    }
}

@media screen and (max-height: 400px) and (orientation: landscape) {
    .chat-input-left {
        width: 100%;
    }

    .chat-input-right {
        width: 20%;
    }

    .chat-input-bar {
        max-height: 2rem;
    }

}
</style>
