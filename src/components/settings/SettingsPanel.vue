<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->

<script setup lang="ts">
import { l } from "@/locales";
import { onMounted, ref } from "vue";
import { vOnClickOutside } from "@vueuse/components";
import { UIFontSize, UIPanels, UIMode, UISettings, UIState, closeBurgerMenu, refreshBurgerMenuButtonsRef } from "@/context/ui";

import LanguageSelector from "@/components/settings/LanguageSelector.vue";
import ThemeSwitch from "@/components/settings/ThemeSwitch.vue";
import Separator from "@/components/common/Separator.vue";
import Panel from "@/components/common/Panel.vue";


const setTextSize = (e: Event) => {
    const el = e.target as HTMLSelectElement;
    UISettings.fontSize = el.value as UIFontSize;
    el.blur();
}

const setScreenSize = (e: Event) => {
    const el = e.target as HTMLSelectElement;
    UISettings.uiMode = el.value as UIMode;
    el.blur();
    if (UISettings.uiMode == UIMode.Mobile) {
        UIState.isNavMenuCompressed = true;
    }
}

const onClickOutside = async (e: Event) => {
    //If clicking outside of chatHistory panel is just clicking again in button of settings => do nothing
    if (UIState.settingsButtonRef && UIState.settingsButtonRef.contains(e.target as Node)) {
        e.stopImmediatePropagation();
        //If it is chat history panel switch between them
    } else if (UIState.chatHistoryButtonRef && UIState.chatHistoryButtonRef.contains(e.target as Node)) {
        UIState.panels.add(UIPanels.ChatHistory);
        UIState.panels.delete(UIPanels.Settings);
        e.stopImmediatePropagation();
    } else {
        UIState.panels.delete(UIPanels.Settings);
        await closeBurgerMenu();
        UIState.isNavMenuCompressed = false;
        UIState.showMenu = false;
    }
};

onMounted(refreshBurgerMenuButtonsRef);

</script>

<template>
    <Panel class="settings-panel" v-on-click-outside="onClickOutside">
        <div class="settings-header">
            {{ $t(l.settings_title) }}
        </div>
        <Separator />
        <LanguageSelector />
        <Separator />
        <ThemeSwitch />
        <Separator />
        <div class="settings-item">
            <label for="settings-text-size">{{ $t(l.settings_ui_size) }}</label>
            <select id="settings-text-size" @change="setTextSize" :value="UISettings.fontSize">
                <option :value="UIFontSize.Normal">{{ $t(l.settings_ui_size_normal) }}</option>
                <option :value="UIFontSize.Large">{{ $t(l.settings_ui_size_large) }}</option>
            </select>
        </div>
        <Separator />
        <div class="settings-item">
            <label for="settings-screen-size">{{ $t(l.settings_ui_screen_size) }}</label>
            <select id="settings-screen-size" @change="setScreenSize" :value="UISettings.uiMode">
                <option :value="UIMode.Dynamic">{{ $t(l.settings_ui_screen_size_dynamic) }}</option>
                <option :value="UIMode.Mobile">{{ $t(l.settings_ui_screen_size_mobile) }}</option>
                <option :value="UIMode.Desktop">{{ $t(l.settings_ui_screen_size_desktop) }}</option>
            </select>
        </div>
        <button class="button-close" @click="onClickOutside">{{ $t(l.button_close) }}</button>
    </Panel>
</template>

<style lang="scss" scoped>
.settings-panel {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
    align-self: flex-end;
    margin: 1rem 0;
    z-index: 8;
    padding: 1rem 2rem;
    width: 12rem;
    gap: 1rem;
    font-weight: bold;
    margin-left: 15rem;
}

.settings-header {
    width: 100%;
    display: flex;
    justify-content: center;
}

.capitalize {
    text-transform: capitalize;
}

.settings-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.button-close {
    margin-top: 1rem;
}

.settings-panels-mobile-screen {
    margin-top: 14rem;
    margin-left: 16rem;
}

.ui-mode-mobile {
    .settings-panel {
        width: 65%;
        margin-left: 4rem;
        margin-bottom: 0rem;
    }
}
</style>
