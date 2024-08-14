<script setup lang="ts">
import { defineProps } from 'vue';
import { UIState } from "@/context/ui";

const props = defineProps<{
    label: string,
    icon?: string,
    active: boolean
}>()
</script>

<template>
    <div class="nav-item" :class="{ 'nav-item-active': props.active }">
        <div :class="'nav-icon icon ' + props.icon">
        </div>
        <div class="nav-link">
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
    gap: .5rem;
}

.nav-item-active {
    background-color: var(--menu-active);
}



@media screen and ((max-aspect-ratio: 1/1) or (max-width: 920px)) {
    .nav-item {
        padding: 2rem;
    }

    .short-nav-menu .nav-item {
        justify-content: center;
        flex-wrap: wrap;
    }

    .short-nav-menu {
        padding: 0rem;
        margin: 1rem;
    }

    .short-nav-menu .nav-link {
        visibility: hidden;
    }

    .short-nav-menu .nav-item-active {
        background-color: transparent !important;
    }
}
</style>
