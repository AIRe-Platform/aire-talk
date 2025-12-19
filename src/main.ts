// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.


import { createApp, ref } from "vue";
import { router } from "./router";
import App from "./App.vue";
import i18n from "./locales";
import { AireStatus, aireSetResponseCallback } from "aire";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
    faThumbsDown,
    faThumbsUp,
    faCopy,
    faEllipsisVertical,
    faArrowsSpin,
    faCheck,
    faArrowsRotate,
    faMoon,
    faSun,
    faMagnifyingGlass,
    faPaperPlane,
    faFile,
    faLink,
    faXmark,
    faFileInvoice,
    faLightbulb,
    faMicrophone,
    faMicrophoneSlash,
    faVolumeHigh,
    faVolumeXmark,
    faComment,
    faSortDown,
    faSortUp
} from "@fortawesome/free-solid-svg-icons";
import useLogin from "./context/login";
import usePlatform from "./context/platform";

library.add(
    faThumbsDown,
    faThumbsUp,
    faCopy,
    faEllipsisVertical,
    faArrowsSpin,
    faCheck,
    faArrowsRotate,
    faMoon,
    faSun,
    faMagnifyingGlass,
    faPaperPlane,
    faFile,
    faLink,
    faXmark,
    faFileInvoice,
    faLightbulb,
    faMicrophone,
    faMicrophoneSlash,
    faVolumeHigh,
    faVolumeXmark,
    faComment,
    faSortDown,
    faSortUp
);

export const AppState = ref<"init" | "loaded" | "error">("init");


async function initApp(): Promise<boolean> {
    if (AppState.value !== "init")
        return true;

    const result = await usePlatform().init()
        .then(async (result) => {
            await useLogin().restoreSession();
            return result;
        })
        .catch((reason) => {
            console.error(reason);
            return false;
        });

    AppState.value = result ? "loaded" : "error";
    return result;
}

const app = createApp(App).component("font-awesome-icon", FontAwesomeIcon);

app.config.errorHandler = (err, instance, info) => {
    console.error(err, instance, info);
};

app.use(i18n).use(router).mount("#app");

// Mobile Safari hack to keep the full page view in place after the keyboard has been closed.
document.addEventListener("focusout", (e: Event) => {
    document.defaultView?.scroll({ top: 0, left: 0, behavior: "smooth" });
});

aireSetResponseCallback(() => {
    useLogin().logout();
    router.replace("/login");
}, AireStatus.LoginRequired);


export async function initWithRetry(): Promise<boolean> {
    let init_counter = 0;
    const MAX_INIT_RETRIES = 5;
    const delay = (ms: number) => {
        return new Promise(res => setTimeout(res, ms))
    }

    while (init_counter <= MAX_INIT_RETRIES) {
        init_counter++;

        if (await initApp()) {
            AppState.value = "loaded";
            return true;
        }

        if (init_counter <= MAX_INIT_RETRIES) {
            console.error(`Failed to connect AIRe services. Retry (${init_counter}/${MAX_INIT_RETRIES})...`);
            await delay(5000);
        }
        else {
            console.error("Giving up. Reload the page.");
            AppState.value = "error";
        }
    }

    return false;
}
