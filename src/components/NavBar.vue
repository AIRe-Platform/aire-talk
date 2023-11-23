<script setup lang="ts">
import { Services } from '@/services/aire';
import { Theme, setTheme } from '@/context/theme';
import { supportedLocales, setLocale, Lang } from '@/locales';
import { Login } from '@/context/login';

const logout = () => {
    Services.ID?.logout();
    Login.logged_in = false;
};

const toggleTheme = () => {
    if(Theme.style === "theme-dark")
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
    <div id="nav-bar">
        <div id="nav-bar-left">
            <RouterLink id="nav-title" class="nav-link" to="/">{{ $t("title") }}</RouterLink>
            <RouterLink class="nav-link" to="/chat">{{ $t("nav_chat") }}</RouterLink>
            <template v-if="Login.logged_in">
                <RouterLink class="nav-link" to="/profile">{{ $t("nav_profile") }}</RouterLink>
            </template>
        </div>
        <div id="nav-bar-right">
            <select name="language" id="langs" @change="setLang" :value="$i18n.locale">
                <option v-for="lang in supportedLocales" :value="lang.lang" :key="lang.lang">{{ lang.name }}</option>
            </select>
            <a href="#" class="nav-link" @click="toggleTheme">{{ $t("nav_theme") }}</a>
            <template v-if="Login.logged_in === true">
                <a href="#" class="nav-link" @click="logout">{{ $t("nav_logout") }}</a>
            </template>
            <template v-if="Login.logged_in === false">
                <RouterLink class="nav-link" to="/signup">{{ $t("nav_signup") }}</RouterLink>
                <RouterLink class="nav-link" to="/login">{{ $t("nav_login") }}</RouterLink>
            </template>
        </div>
    </div>
</template>

<style scoped>
#nav-bar {
    display: flex;
    flex-direction: row;
    flex-shrink: 0;
    justify-content: space-between;
    align-items: center;
    z-index: 10;
    height: 2rem;
    padding: 0.5rem;
    box-shadow: 0 0 5px var(--shadow-color);
}

#nav-title {
    padding: 1rem;
    font-weight: bold;
}

.nav-link {
    padding: 1rem;
}
</style>
