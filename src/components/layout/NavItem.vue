// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

<script setup lang="ts">
import isMobileResolution from "@/helpers/mobile";
import { defineProps } from 'vue';
import { UIState } from "@/context/ui";

const props = defineProps<{
    label: string,
    icon?: string,
    active: boolean
}>()
</script>

<template>

    <!-- <div class="nav-item" :class="{ 'nav-item-active': props.active }">
        <div :class="'nav-icon icon ' + props.icon">
        </div>
        <div class="nav-link">
            {{ props.label }}
        </div> -->

    <div class="nav-item" :class="{ 'nav-item-active': props.active, 'small-layout': UIState.isNavMenuCompressed }">
        <div v-if="!isMobileResolution && props.icon || UIState.isNavMenuCompressed"
            :class="['icon ' + props.icon, { 'nav-item-desktop-icon': !isMobileResolution }]">
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

@media screen and ((max-aspect-ratio: 1/1) or (max-width: 920px)) {

    .nav-item {
        padding: 2rem;
        justify-content: center;
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
