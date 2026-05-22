<!--
    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at https://mozilla.org/MPL/2.0/.
-->

<script setup lang="ts">
import { useTooltip } from '@/context/tooltip';
import { onMounted } from 'vue';

const tooltip = useTooltip().get();

onMounted(() => {
    if (tooltip.value) {
        const { top, left, width, height } = tooltip.value.rect;
        console.log("Show tooltip in pos", top, left, width, height, tooltip.value.position);
    }
})
</script>

<template>
    <div v-if="tooltip" :class="['tooltip', `tooltip-${tooltip.position}`]" :style="{
        top: `${tooltip.rect.top}px`,
        left: `${tooltip.rect.left}px`,
        width: `${tooltip.rect.width}px`,
        height: `${tooltip.rect.height}px`,
    }">
        <span :class="['tooltip-text', `tooltip-text-${tooltip.position}`]">
            {{ tooltip.text }}
        </span>
    </div>
</template>

<style scoped>
.tooltip {
    position: fixed;
    display: flex;
    justify-content: center;
    z-index: 100;
    pointer-events: none;
}

.tooltip-text {
    display: flex;
    position: absolute;
    background-color: var(--tooltip-background-color);
    border: 1px solid var(--tooltip-border-color);
    text-align: center;
    border-radius: 6px;
    padding: 7px 10px 4px 10px;
    align-items: center;
    justify-content: center;
}

.tooltip-text::after {
    content: "";
    position: absolute;
    height: 0;
    width: 0;
}

/* Position right */

.tooltip-right {
    align-items: center;
}

.tooltip-text-right {
    left: calc(100% + 0.5rem);
}

.tooltip-text-right::after {
    border-style: solid;
    left: -0.8rem;
    top: calc(50% - 0.4rem);
    border: 0.4rem solid transparent;
    border-right: 0.4rem solid var(--tooltip-border-color);
}

/* Position left */

.tooltip-left {
    align-items: center;
}

.tooltip-text-left {
    right: calc(100% + 0.5rem);
}

.tooltip-text-left::after {
    border-style: solid;
    right: -0.8rem;
    top: calc(50% - 0.4rem);
    border: 0.4rem solid transparent;
    border-left: 0.4rem solid var(--tooltip-border-color);
}

/* Position bottom */

.tooltip-bottom {
    justify-content: center;
}

.tooltip-text-bottom {
    top: calc(100% + 0.5rem);
}

.tooltip-text-bottom::after {
    border-style: solid;
    top: -0.8rem;
    border: 0.4rem solid transparent;
    border-bottom: 0.4rem solid var(--tooltip-border-color);
}

/* Position top */

.tooltip-top {
    justify-content: center;
}

.tooltip-text-top {
    bottom: calc(100% + 0.5rem);
}

.tooltip-text-top::after {
    border-style: solid;
    bottom: -0.8rem;
    border: 0.4rem solid transparent;
    border-top: 0.4rem solid var(--tooltip-border-color);
}
</style>