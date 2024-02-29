<script setup lang="ts">
import { supportedLocales, setUILanguage, l } from "@/locales";
import { vOnClickOutside } from "@vueuse/components";
import { UIPanels, UIState } from "@/context/ui";
import Panel from "./Panel.vue";
import ISO6391, { LanguageCode } from 'iso-639-1';

const setLang = (e: Event) => {
    const el = e.target as HTMLSelectElement;
    setUILanguage(el.value as LanguageCode);
    el.blur();
};
const onClickOutside = (e: Event) => {
    e.stopImmediatePropagation();
    UIState.panels.delete(UIPanels.Settings);
};
</script>

<template>
    <Panel class="settings-panel" v-on-click-outside="onClickOutside">
        <div class="settings-header">
            {{ $t(l.nav_preferences) }}
        </div>
        <span>
            {{ $t(l.profile_label_language) }}
        </span>
        <select name="language" id="langs" @change="setLang" :value="$i18n.locale">
            <option v-for="lang in supportedLocales" :value="lang" :key="lang">
                {{ ISO6391.getNativeName(lang) }} ({{ ISO6391.getName(lang) }})
            </option>
        </select>
        <button @click="onClickOutside">{{ $t(l.button_close) }}</button>
    </Panel>
</template>

<style scoped>
.settings-header {
    border-bottom-style: dotted;
    padding-bottom: 1rem;
    width: 100%;
    display: flex;
    justify-content: center;
}

.settings-panel {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    align-self: flex-end;

    margin: 1rem 0;
    gap: 2rem;
    z-index: 8;

    padding: 2rem 3rem;
}

@media screen and (max-width: 600px) {
    .settings-panel {
        width: 100%;
    }
}
</style>
