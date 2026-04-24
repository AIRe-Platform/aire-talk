<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->

<script setup lang="ts">
import { l } from "@/locales";
import { vOnClickOutside } from "@vueuse/components";
import { UIFontSize, UIPanels, UIState } from "@/context/ui";
import Tooltip from "@/components/common/Tooltip.vue";
import LanguageSelector from "@/components/settings/LanguageSelector.vue";
import ThemeSwitch from "@/components/settings/ThemeSwitch.vue";
import Separator from "@/components/common/Separator.vue";
import Panel from "@/components/common/Panel.vue";

const setTextSize = (e: Event) => {
    const el = e.target as HTMLSelectElement;
    const fontSize = el.value as UIFontSize;
    UIState.setFontSize(fontSize);
}

const onClickOutside = async (e: Event) => {
    UIState.closePanel(UIPanels.Settings);
    e.stopImmediatePropagation();
};

const currentSize = UIState.fontSize();
</script>

<template>
    <Panel class="settings-panel" v-on-click-outside="onClickOutside">
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
            <Tooltip :text="$t(l.settings_ui_size)" position="top">
                <select id="settings-text-size" @change="setTextSize" :value="currentSize">
                    <option :value="UIFontSize.Normal">{{ $t(l.settings_ui_size_normal) }}</option>
                    <option :value="UIFontSize.Large">{{ $t(l.settings_ui_size_large) }}</option>
                </select>
            </Tooltip>
        </div>
        <Separator />
        <button class="btn" @click="onClickOutside">{{ $t(l.button_close) }}</button>
    </Panel>
</template>

<style lang="scss" scoped>
.settings-panel {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
    text-align: center;

    margin: 1rem 10px;
    padding: 1rem 2rem;
    width: 12rem;
    gap: 0.2rem;
    z-index: 8;
    font-weight: bold;

    align-self: flex-start;
    margin-top: auto;
}

.settings-label {
    width: 12rem;
}

.settings-header {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-block-end: 0;
}

.settings-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

@media screen and ((max-aspect-ratio: 1/1) or (max-width: 920px)) {
    .settings-panel {
        width: calc(100% - 3rem);
        max-width: 12rem;
        padding: 1rem;
        margin-left: 0.5rem;
    }
}
</style>
