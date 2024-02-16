<script setup lang="ts">
import { Theme, setTheme } from '@/context/theme';
import { supportedLocales, setLocale, Lang } from '@/locales';
import { vOnClickOutside } from '@vueuse/components'
import { UIState } from '@/context/ui';


const toggleTheme = () => {
    if (Theme.style === "theme-dark")
        setTheme("theme-default")
    else
        setTheme("theme-dark");
};
const setLang = (e: Event) => {
    const el = e.target as HTMLSelectElement;
    setLocale(el.value as Lang);
    el.blur();
}
const onClickOutside = (e: Event) => {
    e.stopImmediatePropagation()
    UIState.showSettingsPanel = false
}
</script>

<template>
    <div class="settings-view" v-on-click-outside="onClickOutside">
        <div class="settings-content">
            <select name="language" id="langs" @change="setLang" :value="$i18n.locale">
                <option v-for="lang in supportedLocales" :value="lang.lang" :key="lang.lang">{{ lang.name }}</option>
            </select>
            <a class="nav-link" @click="toggleTheme">{{ $t("nav_theme") }}</a>
        </div>
    </div>
</template>

<style scoped>
.settings-view {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 87vh;
    margin-bottom: 1rem;
}

.settings-content {
    display: flex;
    flex-direction: column;
    width: 60%;
    box-shadow: 0 0 5px var(--shadow-color);
    background-color: var(--panel-background-color);
    border-radius: 1rem;
    padding: 2rem 3rem;
    flex-grow: 1;
    gap: 2rem;
    justify-content: center;
    align-items: center;
}

@media screen and (max-width: 600px) {

    .settings-view {
        z-index: 8;
        margin-bottom: 2rem;
    }   
     .settings-content {
        width: 70%;
        padding: 1rem 2rem;
    }
}
</style>