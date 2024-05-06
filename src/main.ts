import { createApp, ref } from "vue";
import { router } from "./router";
import App from "./App.vue";
import i18n from "./locales";
import { AireStatus, aireInit, aireSetResponseCallback } from "aire";
import { logout, restoreSession } from "./context/login";
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
} from "@fortawesome/free-solid-svg-icons";

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
    faPaperPlane
);

export const AppState = ref<"init" | "loaded" | "error">("init");

export async function initApp() {
    if (AppState.value !== "init") return;

    const result = await aireInit({
        api_url:
            import.meta.env.VITE_AIRE_SERVICES_ENDPOINT ||
            "http://localhost:7071/api",
    })
        .then(async (result) => {
            if (result) {
                await restoreSession();
                return true;
            }
            return false;
        })
        .catch((reason) => {
            console.error(reason);
            return false;
        });

    AppState.value = result ? "loaded" : "error";
    console.debug("App init done");
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
    logout();
    router.replace("/login");
}, AireStatus.LoginRequired);
