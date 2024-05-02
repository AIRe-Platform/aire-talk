<script setup lang="ts">
import { supportedLocales, setUILanguage, l } from "@/locales";
import { vOnClickOutside } from "@vueuse/components";
import { UIFontSize, UIPanels, UISettings, UIState } from "@/context/ui";
import Panel from "./Panel.vue";
import ISO6391, { LanguageCode } from 'iso-639-1';
import ThemeSwitch from "./ThemeSwitch.vue";
import SectionSeparator from "./SectionSeparator.vue";


const setLang = async (e: Event) => {

    const el = e.target as HTMLSelectElement;
    setUILanguage(el.value as LanguageCode);
    el.blur();
};

const setTextSize = (e: Event) => {
    const el = e.target as HTMLSelectElement;
    UISettings.fontSize = el.value as UIFontSize;
    el.blur();
}

const onClickOutside = (e: Event) => {
    e.stopImmediatePropagation();
    UIState.panels.delete(UIPanels.Settings);
};
</script>

<template>
    <Panel class="settings-panel" v-on-click-outside="onClickOutside">
        <div class="settings-header">
            {{ $t(l.settings_title) }}
        </div>
        <SectionSeparator />
        <div class="settings-item">
            <label for="settings-language">{{ $t(l.settings_language) }}</label>
            <select id="settings-language" class="capitalize" @change="setLang" :value="$i18n.locale">
                <option v-for="lang in supportedLocales" :value="lang" :key="lang">
                    {{ ISO6391.getNativeName(lang) }} ({{ ISO6391.getName(lang) }})
                </option>
            </select>
        </div>
        <SectionSeparator />
        <ThemeSwitch />
        <SectionSeparator />
        <div class="settings-item">
            <label for="settings-text-size">{{ $t(l.settings_ui_size) }}</label>
            <select id="settings-text-size" @change="setTextSize" :value="UISettings.fontSize">
                <option :value="UIFontSize.Normal">{{ $t(l.settings_ui_size_normal) }}</option>
                <option :value="UIFontSize.Large">{{ $t(l.settings_ui_size_large) }}</option>
            </select>
        </div>
        <button class="button-close" @click="onClickOutside">{{ $t(l.button_close) }}</button>
    </Panel>
</template>

<style scoped>
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

@media screen and ((max-aspect-ratio: 1/1) or (max-width: 920px)) {
    .settings-panel {
        width: 100%;
        margin-left: 15rem;
    }
}
</style>
