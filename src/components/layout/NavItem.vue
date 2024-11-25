<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->

<script setup lang="ts">
import { defineProps } from 'vue';
import { UIState } from "@/context/ui";
import Tooltip from "@/components/common/Tooltip.vue";

const props = defineProps<{
    label: string,
    icon?: string,
    active: boolean,
    tooltip: string,
}>()

// create the new key from the label, with lower case all and replacing spaces with _
function formatTooltipKey(tooltip: string): string {
    return 'tooltip_' + tooltip;
}
</script>

<template>
    <div class="nav-item" :class="{ 'nav-item-active': props.active, 'small-layout': UIState.isNavMenuCompressed }">
        <div v-if="props.icon || UIState.isNavMenuCompressed" :class="['icon ' + props.icon]">
        </div>
        <Tooltip :text=$t(formatTooltipKey(props.tooltip)) position="top" :useMaxContent="false" :adjustPosition="true">
            <div class="nav-link">
                {{ props.label }}
            </div>
        </Tooltip>
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

    &:hover {
        color: var(--nav-item-hover);
    }
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

    .short-nav-menu .nav-link {
        display: none;
        width: 0;
        height: 0;
    }

    .nav-item-active {
        background-color: transparent;
    }
}
</style>
