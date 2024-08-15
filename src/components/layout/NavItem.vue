<script setup lang="ts">
import useMobileLayout from "@/helpers/mobile";
import { defineProps } from 'vue';
import { UIState } from "@/context/ui";

const props = defineProps<{
    label: string,
    icon?: string,
    active: boolean
}>()
</script>

<template>
    <div class="nav-item" :class="{ 'nav-item-active': props.active, 'small-layout': UIState.isNavMenuCompressed }">
        <div v-if="!useMobileLayout && props.icon || UIState.isNavMenuCompressed"
            :class="['icon ' + props.icon, { 'nav-item-desktop-icon': !useMobileLayout }]">
        </div>
        <div class="nav-link" v-if="!UIState.isNavMenuCompressed || !props.icon">
            {{ props.label }}
        </div>

    </div>
</template>

<style lang="scss" scoped>
.nav-item {
    padding: 1rem;
    display: flex;
    justify-content: flex-start;
    cursor: pointer;
    text-align: center;
    font-weight: bold;
    align-items: center;
    gap: 1rem;
}

.nav-item-active {
    background-color: var(--menu-active);
}

.nav-item-desktop-icon {
    transform: scale(0.7) !important;
}

.ui-mode-mobile {
    .nav-item {
        padding: 2rem;
        justify-content: center;
    }

    .small-layout {
        padding: 0rem;
        margin: 1rem;
    }
}
</style>
