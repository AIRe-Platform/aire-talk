<script setup lang="ts">
import { Theme, setTheme } from '@/context/theme';
import Switch from './Switch.vue';

const onSwitchTheme = (dark: boolean) => {
    setTheme(dark ? "theme-dark" : 'theme-default')
}

</script>

<template>
    <div class="theme-switch">
        <font-awesome-icon icon="fa-solid fa-sun" />
        <Switch :is-on="Theme.style === 'theme-dark'" @change="onSwitchTheme"/>
        <font-awesome-icon icon="fa-solid fa-moon" />
    </div>
</template>

<style scoped>
.theme-switch {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin: 0.2rem 1rem;
}
</style>