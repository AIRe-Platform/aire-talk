<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->

<script setup lang="ts">
import { UIState } from "@/context/ui";
import NavItemContent from './NavItemContent.vue';

const props = defineProps<{
    label: string,
    icon?: string,
    active: boolean,
    tooltip?: string,
    tabindex: number,
    itemType: 'link' | 'button',
}>()
</script>

<template>
    <a v-if="props.itemType === 'link'" href="#" class="nav-item" :aria-label="props.label"
        :class="[{ 'nav-item-active': props.active, 'small-layout': UIState.isNavMenuCompressed }]"
        :tabindex="props.tabindex" @click="$emit('click')" @keydown.space="$emit('click')">
        <NavItemContent :label="props.label" :icon="props.icon" :tooltip="props.tooltip" />
    </a>
    <button v-else type="button" class="nav-item nav-btn" :aria-label="props.label"
        :class="[{ 'nav-item-active': props.active, 'small-layout': UIState.isNavMenuCompressed }]"
        :tabindex="props.tabindex" @click="$emit('click')">
        <NavItemContent :label="props.label" :icon="props.icon" :tooltip="props.tooltip" />
    </button>
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

    &:hover {
        color: var(--nav-item-hover);
    }
}

.nav-btn {
    border: none;
    background-color: transparent;
    color: var(--text-color);
    font-weight: 700;
    font-size: inherit;
    font-family: inherit;
}

.nav-item-active {
    background-color: var(--menu-active);
}

@media screen and ((max-aspect-ratio: 1/1) or (max-width: 920px)) {

    .nav-item {
        padding: 2rem;
    }

    .short-nav-menu .nav-item {
        flex-wrap: wrap;
    }

    .short-nav-menu {
        padding: 0rem;
        margin: 1rem;
    }

    .nav-item-active {
        background-color: transparent;
    }
}
</style>
