<script setup lang="ts">
import { l } from "@/locales";
import { vOnClickOutside } from "@vueuse/components";
import { UIFontSize, UIPanels, UISettings, UIState } from "@/context/ui";

import LanguageSelector from "@/components/settings/LanguageSelector.vue";
import ThemeSwitch from "@/components/settings/ThemeSwitch.vue";
import Separator from "@/components/common/Separator.vue";
import Panel from "@/components/common/Panel.vue";


const setTextSize = (e: Event) => {
    const el = e.target as HTMLSelectElement;
    UISettings.fontSize = el.value as UIFontSize;
    el.blur();
}

const onClickOutside = (e: Event) => {
    //e.stopImmediatePropagation();
    UIState.panels.delete(UIPanels.Settings);
    UIState.isNavMenuCompressed = false;
};
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

@media screen and ((max-aspect-ratio: 1/1) or (max-width: 920px)) {
    .settings-panel {
        width: 65%;
        margin-left: 4rem;
        margin-bottom: 0rem;
    }
}
</style>
