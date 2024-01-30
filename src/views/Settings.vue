<script setup lang="ts">
import { defineComponent } from 'vue';
import BurgerMenu from './BurgerMenu.vue';
defineComponent({ name: "SettingsView" });
import { Theme, setTheme } from '@/context/theme';
import { supportedLocales, setLocale, Lang } from '@/locales';

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

</script>

<template>
    <Burger-menu></Burger-menu>
    <div class="main-content">
        <select name="language" id="langs" @change="setLang" :value="$i18n.locale">
            <option v-for="lang in supportedLocales" :value="lang.lang" :key="lang.lang">{{ lang.name }}</option>
        </select>
        <a href="#" class="nav-link" @click="toggleTheme">{{ $t("nav_theme") }}</a>
    </div>
</template>

<style scoped>
.main-content {
    width: 15%;
    max-height: 10rem;
    display: flex;
    flex-direction: column;
    box-shadow: 0 0 5px var(--shadow-color);
    background-color: var(--panel-background-color);
    padding: 2rem 3rem;
    flex-grow: 1;
    justify-content: space-around;
    align-items: center;
}

/* mobile*/
@media screen and (max-width: 600px) {
    .main-content {
        width: 40%;
    }
}
</style>