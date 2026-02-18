<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->

<script setup lang="ts">
import { l } from "@/locales";
import { onMounted, onUnmounted, ref } from "vue";
import { vOnClickOutside } from "@vueuse/components";
import { UIFontSize, UIPanels, UISettings, UIState, closeBurgerMenu, refreshBurgerMenuButtonsRef } from "@/context/ui";
import Tooltip from "@/components/common/Tooltip.vue";
import LanguageSelector from "@/components/settings/LanguageSelector.vue";
import ThemeSwitch from "@/components/settings/ThemeSwitch.vue";
import Separator from "@/components/common/Separator.vue";
import Panel from "@/components/common/Panel.vue";

const settingsPanelRef = ref<HTMLElement | null>(null);
const setTextSize = (e: Event) => {
    const el = e.target as HTMLSelectElement;
    UISettings.fontSize = el.value as UIFontSize;
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

const focusOutListener = async (e: FocusEvent) => {
    const relTarget = e.relatedTarget as Node;
    if (!settingsPanelRef.value?.contains(relTarget)) {
        UIState.panels.delete(UIPanels.Settings);
        if (UIState.isNavMenuCompressed)
            UIState.isNavMenuCompressed = false;
    }
};

onMounted(() => {
    refreshBurgerMenuButtonsRef();
    settingsPanelRef.value?.addEventListener('focusout', focusOutListener);
});

onUnmounted(() => settingsPanelRef.value?.removeEventListener('focusout', focusOutListener));
</script>

<template>
    <Panel class="settings-panel" v-on-click-outside="onClickOutside">
        <div ref="settingsPanelRef" class="settings-panel-ref">
            <h2 class="settings-header">
                {{ $t(l.settings_title) }}
            </h2>
            <Separator />
            <LanguageSelector />
            <Separator />
            <ThemeSwitch />
            <Separator />
            <div class="settings-item">
                <label for="settings-text-size">{{ $t(l.settings_ui_size) }}</label>
                <Tooltip :text="$t(l.settings_ui_size)" position="top" :useMaxContent="false" :adjustPosition="true">
                    <select id="settings-text-size" @change="setTextSize" :value="UISettings.fontSize">
                        <option :value="UIFontSize.Normal">{{ $t(l.settings_ui_size_normal) }}</option>
                        <option :value="UIFontSize.Large">{{ $t(l.settings_ui_size_large) }}</option>
                    </select>
                </Tooltip>
            </div>
            <Separator />
            <button class="btn button-close" @click="onClickOutside">{{ $t(l.button_close) }}</button>
        </div>
    </Panel>
</template>

<style lang="scss" scoped>
.settings-panel {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
    align-self: flex-end;
    margin: 1rem 10px;
    z-index: 8;
    padding: 1rem 2rem;
    width: 12rem;
    gap: 1rem;
    font-weight: bold;
    margin-left: 15rem;
}

.settings-panel-ref {
    display: flex;
    flex-direction: column;
}

#settings-text-size {
    width: 12rem;
}

.settings-header {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-block-end: 0;
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



@media screen and ((max-aspect-ratio: 1/1) or (max-width: 520px)) {
    .settings-panel {
        width: 58%;
        margin-left: 5rem;
        margin-bottom: 0rem;
        font-size: var(--font-small);

    }

    .settings-panel-ref {
        display: flex;
    }

    #settings-text-size {
        width: -webkit-fill-available;
    }
}

@media screen and (max-height: 400px) and (orientation: landscape) {
    .settings-panel {
        margin-left: -15rem;
        padding: 0.5rem 2rem;
    }

    .button-close {
        margin-top: 0.5rem;
    }
}
</style>
