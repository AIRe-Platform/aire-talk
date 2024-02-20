<script setup lang="ts">
import { Theme, setTheme } from "@/context/theme";
import { supportedLocales, setLocale, Lang, l } from "@/locales";
import { vOnClickOutside } from "@vueuse/components";
import { UIState } from "@/context/ui";

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
    UIState.showSettingsPanel = false;
};
</script>

<template>
    <div class="settings-panel" v-on-click-outside="onClickOutside">
        <select name="language" id="langs" @change="setLang" :value="$i18n.locale">
            <option v-for="lang in supportedLocales" :value="lang.lang" :key="lang.lang">
                {{ lang.name }}
            </option>
        </select>
        <div class="nav-link" @click="toggleTheme">{{ $t(l.nav_theme) }}</div>
        <button @click="onClickOutside">{{ $t(l.button_close) }}</button>
    </div>
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

    box-shadow: 0 0 5px var(--shadow-color);
    background-color: var(--panel-background-color);
    border-radius: 1rem;
    padding: 2rem 3rem;
}

@media screen and (max-width: 600px) {
    .settings-panel {
        width: 100%;
    }
}
</style>
