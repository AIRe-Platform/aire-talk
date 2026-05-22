<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->

<script setup lang="ts">
import { UIState } from "@/context/ui";
import Tooltip from "../common/Tooltip.vue";
import { computed } from "vue";

const props = defineProps<{
    label: string,
    icon?: string,
    active: boolean,
    tooltip: string,
    tabindex: number,
}>()

const menuCompressed = UIState.compressMenu();

function formatTooltipKey(tooltip?: string) {
    if (tooltip)
        return 'tooltip_' + tooltip;
    else
        return undefined;
}

const text = computed(() => formatTooltipKey(props.tooltip));
</script>

<template>
    <button type="button" class="nav-item nav-btn" :aria-label="props.label"
        :class="[{ 'nav-item-active': props.active, 'nav-item-compress': menuCompressed }]" :tabindex="props.tabindex"
        @click="$emit('click')">
        <Tooltip :text="!!(text) ? $t(text) : ''" position="right">
            <div class="nav-item-content">
                <div class="nav-icon">
                    <div v-if="props.icon" :class="['icon ' + props.icon]"></div>
                </div>
                <div class="nav-label" v-if="!menuCompressed">
                    {{ props.label }}
                </div>
            </div>
        </Tooltip>
    </button>
</template>

<style lang="scss" scoped>
.nav-item {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    cursor: pointer;
    text-align: center;
    font-weight: bold;
    align-items: stretch;
    padding: 0;

    &:hover {
        color: var(--nav-item-hover);
    }
}

.nav-item-content {
    display: flex;
    flex-direction: row;
    padding: 1rem;
    gap: 1rem;
}

.nav-icon {
    display: flex;
    width: 2rem;
    height: 2rem;
    align-items: center;
    justify-content: center;
}

.nav-label {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    text-align: left;
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

    // .nav-item {
    //     padding: 2rem;
    // }

    // .short-nav-menu .nav-item {
    //     flex-wrap: wrap;
    // }

    // .short-nav-menu {
    //     padding: 0rem;
    //     margin: 1rem;
    // }

    // .nav-item-active {
    //     background-color: transparent;
    // }
}
</style>
