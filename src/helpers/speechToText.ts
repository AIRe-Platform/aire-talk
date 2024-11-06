// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { getUILanguage } from "@/locales";
import { useSpeechRecognition } from "@vueuse/core";
import { computed, Ref, watch } from "vue";

export default function useSTT() {
    const recognition = useSpeechRecognition({
        interimResults: false,
        continuous: false
    });

    let callback = (_: string) => { };
    watch(recognition.result, () => {
        if (recognition.isFinal.value) {
            callback(recognition.result.value);
        }
    })

    return {
        listen: (cb: (result: string) => void) => {
            if (!recognition.recognition)
                return;

            recognition.recognition.lang = getUILanguage().value;
            if (recognition.isSupported.value) {
                callback = cb;
                recognition.start();
            }
        },
        stop: () => {
            recognition.stop();
        },
        isSupported: computed(() => {
            if (!recognition.recognition)
                return false;

            recognition.recognition.lang = getUILanguage().value;
            return recognition.isSupported.value;
        }),
        isListening: recognition.isListening as Ref<boolean>
    }
}
