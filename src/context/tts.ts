// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

import { getUILanguage } from "@/locales";
import { useSpeechSynthesis } from "@vueuse/core";
import { reactive } from "vue";

export class TTSContext {
    public enabled: boolean;

    constructor() {
        this.enabled = localStorage.getItem("tts-enabled") === "true";
    }

    public toggle(value?: boolean) {
        this.enabled = (value ?? !this.enabled);
        localStorage.setItem("tts-enabled", this.enabled ? "true" : "false");
    }

    public speak(something: string) {
        if (!this.enabled)
            return;

        const tts = useSpeechSynthesis(something, {
            lang: getUILanguage()
        });

        if (tts.isSupported)
            tts.speak();
    }

    public supported() {
        const tts = useSpeechSynthesis("", {
            lang: getUILanguage()
        });
        return tts.isSupported;
    }
}

const context = reactive(new TTSContext());

export default function useTTS() {
    return context;
}
