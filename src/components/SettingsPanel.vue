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
            <div class="settings">
                <select name="language" id="langs" @change="setLang" :value="$i18n.locale">
                    <option v-for="lang in supportedLocales" :value="lang.lang" :key="lang.lang">{{ lang.name }}</option>
                </select>
                <a class="nav-link" @click="toggleTheme">{{ $t("nav_theme") }}</a>
            </div>
            <div class="settings-button" @click="onClickOutside">
                <font-awesome-icon icon="fa-solid fa-xmark" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.settings-button{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    width: 2rem;
    height: 1rem;
    z-index: 10;
    background-color: var(--panel-background-color);
    border-radius: .5rem;
    border: 1px solid var(--border-color);
    box-shadow: 0 0 5px var(--shadow-color);
    cursor: pointer;
    align-self: flex-start;
}
.settings-view {
    display: flex;
    flex-direction: column;
    margin-top: auto;
    margin-bottom: 2rem;
    margin-left: 1rem;
}

.settings{
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    height: 6rem;
    margin-top: 2rem;
}

.settings-content {
    display: flex;
    flex-direction: row;
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
        margin-top: 63vh;
        width: 100vw;
        height: 26vh;
    }   
     .settings-content {
        width: 75%;
        padding: 1rem 2rem;
    }
    .settings-button{
        width: 1rem;
        margin-left: 3rem;
    }
}
</style>