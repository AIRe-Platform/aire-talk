<script setup lang="ts">
import { Theme, setTheme } from "@/context/theme";
import { supportedLocales, setLocale, Lang, l } from "@/locales";
import { vOnClickOutside } from "@vueuse/components";
import { UIPanels, UIState } from "@/context/ui";
import Panel from "./Panel.vue";

const toggleTheme = () => {
    if (Theme.style === "theme-dark") setTheme("theme-default");
    else setTheme("theme-dark");
};
const setLang = (e: Event) => {
    const el = e.target as HTMLSelectElement;
    setLocale(el.value as Lang);
    el.blur();
};
const onClickOutside = (e: Event) => {
    e.stopImmediatePropagation();
    UIState.panels.delete(UIPanels.Settings)
};
</script>

<template>
    <Panel class="settings-panel" v-on-click-outside="onClickOutside">
        <select name="language" id="langs" @change="setLang" :value="$i18n.locale">
            <option v-for="lang in supportedLocales" :value="lang.lang" :key="lang.lang">
                {{ lang.name }}
            </option>
        </select>
        <div class="nav-link" @click="toggleTheme">{{ $t(l.nav_theme) }}</div>
        <button @click="onClickOutside">{{ $t(l.button_close) }}</button>
    </Panel>
</template>

<style scoped>
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
