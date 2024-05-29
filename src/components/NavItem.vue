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
    <div class="nav-item" :class="{ 'nav-item-active': props.active, 'small-layout': UIState.isNavMenuCompressed }">
        <div class="nav-link" v-if="!UIState.isNavMenuCompressed || !props.icon">
            {{ props.label }}
        </div>
        <div v-if="UIState.isNavMenuCompressed && props.icon" :class="'icon ' + props.icon">
        </div>
    </div>
</template>

<style lang="scss" scoped>
.nav-item {
    padding: 1rem;
    display: flex;
    justify-content: center;
    cursor: pointer;
    text-align: center;
    font-weight: bold;
}

.nav-item-active {
    background-color: var(--menu-active);
}

.ui-mode-mobile {
    .nav-item {
        padding: 2rem;
    }

    .small-layout {
        padding: 0rem;
        margin: 1rem;
    }
}
</style>
