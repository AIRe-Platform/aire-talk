<script setup lang="ts">
import { Theme } from '@/context/theme';
import Switch from './Switch.vue';

const onSwitchTheme = (dark: boolean) => {
    Theme.style = dark ? "theme-dark" : 'theme-default'
}

</script>

<template>
    <div class="theme-container">
        <p class="theme-switch-label"> Color mode</p>
        <div class="theme-switch">
            <font-awesome-icon icon="fa-solid fa-sun" />
            <Switch :is-on="Theme.style === 'theme-dark'" @change="onSwitchTheme" />
            <font-awesome-icon icon="fa-solid fa-moon" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.theme-container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.theme-switch-label {
    margin: 0;
}

.theme-switch {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    color: var(--button-color);
    width: 100%;
}
</style>