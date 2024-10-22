<!--
 This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->

<script setup lang="ts">
import { AppState } from '@/main';
import { UIPanels, UIState } from '@/context/ui';
import { closeBurgerMenu } from "@/context/ui";
import FooterBar from '@/components/layout/FooterBar.vue';
import NavMenu from '@/components/layout/NavMenu.vue';
import ChatHistory from '@/components/chat/ChatHistory.vue';
import SettingsPanel from '@/components/settings/SettingsPanel.vue';
import AppLoadingIndicator from '@/components/layout/AppLoadingIndicator.vue';
import { LOGOUT_WARNING_START, startInactivityListener, stopInactivityListener } from '@/helpers/inactivityLogout';
import { onMounted, onUnmounted, reactive, watch } from 'vue';
import useLogin from '@/context/login';
import DialogModal from "@/components/layout/DialogModal.vue";
import { l } from '@/locales';
import { router } from './router';


const login = useLogin();
const state = reactive<{
    showInactivityPopup: boolean
    showInactivityWarningPopup: boolean
    logoutCountdown: number
}>({
    showInactivityPopup: false,
    showInactivityWarningPopup: false,
    logoutCountdown: 0,
});
let logoutCountdownInterval: number | undefined;

const closeNavMenu = async () => {
    await closeBurgerMenu();
    UIState.showMenu = false;
    UIState.isNavMenuCompressed = false;
    UIState.panels.clear();
};

const onInactivityTimeout = async () => {
    stopInactivityListener();
    login.logout("inactivity=1");
};

const closeInactivityPopup = () => {
    router.push("/");
    state.showInactivityPopup = false;
}

const setInactivityWarningPopupVisibility = (newState: boolean) => {
    state.showInactivityWarningPopup = newState;
    if (newState) {
        state.logoutCountdown = Math.ceil(LOGOUT_WARNING_START / 1000);
        logoutCountdownInterval = setInterval(() => {
            if (state.logoutCountdown > 0) {
                state.logoutCountdown--;
            } else {
                clearInterval(logoutCountdownInterval);
            }
        }, 1000);
    } else {
        clearInterval(logoutCountdownInterval);
    }
}

onMounted(() => {
    const stopLoginWatch = watch(
        () => login.user,
        (user) => {
            if (user && !import.meta.env.VITE_DEBUG_DISABLE_SESSION_TIMEOUT) {
                startInactivityListener(onInactivityTimeout, setInactivityWarningPopupVisibility);
            }
            else {
                stopInactivityListener();
            }
        }
    );

    onUnmounted(() => {
        stopLoginWatch();
        stopInactivityListener();
    });

    const search = new URLSearchParams(window.location.search);
    state.showInactivityPopup = search.get("inactivity") == "1";
});
</script>

<template>
    <DialogModal :active="state.showInactivityPopup" :buttons="[{ loc_key: l.button_accept, onClick: closeInactivityPopup }]">
        {{ $t(l.logout_inactivity_message) }}
    </DialogModal>
    <DialogModal :active="state.showInactivityWarningPopup" :buttons="[]">
        {{ $t(l.logout_inactivity_warning_message, { duration: state.logoutCountdown }) }}
    </DialogModal>
    <div id="main" v-if="AppState === 'loaded'" tabindex="0">
        <NavMenu />
        <div class="main-panels" v-if="UIState.panels.size > 0">
            <ChatHistory v-if="UIState.panels.has(UIPanels.ChatHistory)" />
            <SettingsPanel v-if="UIState.panels.has(UIPanels.Settings)" />
        </div>
        <div class="main-content">
            <div class="main-mask" v-if="UIState.showMenu" @click="closeNavMenu"></div>
            <RouterView />
        </div>
        <FooterBar />
    </div>
    <div class="main-splash" v-if="AppState === 'init'">
        <AppLoadingIndicator />
    </div>
    <div class="main-error" v-if="AppState === 'error'">
        {{ $t("error_generic") }}
    </div>
</template>



<style src="@/style/default.css" />
<style src="@/style/icons.css" />
<style lang="scss" scoped>
#main {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    height: 100%;
    max-height: 100%;
    pointer-events: auto;
}

.main-mask {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 3;
    backdrop-filter: blur(2px);
}

.main-content {
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    overflow: auto;
    background-color: var(--background-color);
    background-image: var(--back-ground-texture);
    background-size: cover;
    position: relative;
}

.main-panels {
    position: fixed;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    overflow: hidden;
    padding: 1rem;
    top: 0;
    bottom: 0;
    z-index: 5;
}

.main-splash,
.main-error {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    overflow: auto;
    align-items: stretch;
    justify-content: center;
    text-align: center;
    background-color: var(--panel-background-color);
}

@media screen and ((max-aspect-ratio: 1/1) or (max-width: 920px)) {
    .main-content {
        font-size: var(--font-small);
    }

    .main-panels {
        top: -4rem;
        bottom: 0rem;
        left: 0;
        right: 0;

        align-items: center;
        justify-content: center;
    }
}
</style>
