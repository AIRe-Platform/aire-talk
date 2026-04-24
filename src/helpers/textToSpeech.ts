// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { getUILanguage } from "@/locales";
import { useSpeechSynthesis } from "@vueuse/core";
import { computed, reactive, ref } from "vue";

const ttsState = reactive<{
    playing: boolean,
    enabled: boolean
}>({
    playing: false,
    enabled: (localStorage.getItem("tts-enabled") === "true")
});

export default function useTTS() {
    const synthesis = useSpeechSynthesis('')
    const playing = ref(false);

    synthesis.utterance.value.onend = () => playing.value = false;
    synthesis.utterance.value.onerror = () => playing.value = false;
    synthesis.utterance.value.onpause = () => playing.value = false;
    synthesis.utterance.value.onstart = () => playing.value = true;
    synthesis.utterance.value.onresume = () => playing.value = true;

    return {
        speak: (something: string) => {
            synthesis.utterance.value.text = something;
            synthesis.utterance.value.lang = getUILanguage().value;
            if (synthesis.isSupported.value)
                synthesis.speak();
        },
        stop: () => {
            synthesis.stop();
        },
        enable: (enabled: boolean) => {
            localStorage.setItem("tts-enabled", enabled ? "true" : "false");
            ttsState.enabled = enabled;
        },
        isEnabled: computed(() => {
            return ttsState.enabled;
        }),
        isSupported: computed(() => {
            synthesis.utterance.value.lang = getUILanguage().value;
            return synthesis.isSupported.value;
        }),
        isSpeaking: playing
    }
}
