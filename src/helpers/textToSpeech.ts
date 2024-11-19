// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { getUILanguage } from "@/locales";
import { useSpeechSynthesis } from "@vueuse/core";
import { computed, ref } from "vue";

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
        isSupported: computed(() => {
            synthesis.utterance.value.lang = getUILanguage().value;
            return synthesis.isSupported.value;
        }),
        isSpeaking: playing
    }
}
