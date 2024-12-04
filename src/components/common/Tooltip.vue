<!--
    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at https://mozilla.org/MPL/2.0/.
-->

<script setup lang="ts">
import { defineProps, defineEmits, defineComponent } from 'vue';
import { adjustTooltipPosition, TooltipPosition } from '@/helpers/tooltipUtils';
import { tooltipState } from '@/context/tooltipState';

defineComponent({ name: "TooltipComponent" })

const props = defineProps<{
    text: string;
    position?: TooltipPosition;
    useMaxContent?: boolean; // Control tooltip width
    adjustPosition?: boolean; // Whether to adjust position dynamically
}>();

const emit = defineEmits<{
    'mouseenter': [MouseEvent, string],
    'mouseleave': [MouseEvent]
}>();

const resetVisibilityTooltips = () => {
    tooltipState.isVisible = true;
};

const onMouseEnter = (event: MouseEvent) => {
    resetVisibilityTooltips();
    if (props.adjustPosition) {
        adjustTooltipPosition(event, props.useMaxContent ?? false, props.position);
    }
    emit('mouseenter', event, props.position || 'top');
};

const onMouseLeave = (event: MouseEvent) => {
    emit('mouseleave', event);
};
</script>

<template>
    <div class="tooltip-container" @mouseenter="onMouseEnter" @mouseleave="onMouseLeave">
        <slot></slot>
        <span v-if="tooltipState.isVisible" class="tooltiptext" :class="props.position">{{ props.text }}</span>
    </div>
</template>

<style scoped>
.tooltip-container {
    position: relative;
    display: flex;
    justify-content: center;

}

.tooltiptext {
    visibility: hidden;
    width: max-content;
    color: var(--tooltip-text-color);
    text-align: center;
    border-radius: 6px;
    padding: 5px 10px;
    position: absolute;
    z-index: 10;
    bottom: 125%;
    opacity: 0;
    transition: opacity 0.3s;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--tooltip-background-color);
    border: 1px solid var(--tooltip-border-color);
}

.tooltiptext::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: var(--tooltip-border-color, var(--tooltip-background-color)) transparent transparent transparent;
}



.tooltiptext[data-avoid-crop-position="top"] {
    bottom: auto;
    top: 125%;
}

.tooltiptext[data-avoid-crop-position="bottom"] {
    top: auto;
    bottom: 125%;
}

.tooltiptext[data-avoid-crop-position="top-left"] {
    right: 20%;
    left: auto;
    transform: translateX(0);
}

.tooltiptext[data-avoid-crop-position="left"] {
    right: calc(100% + 10px);
    left: auto;
    top: 0%;
    bottom: 0%;
    transform: translateX(0);
}

.tooltiptext[data-avoid-crop-position="right"] {
    left: 100%;
    transform: translateX(0);
}

.tooltiptext[data-avoid-crop-position="bottom-left"] {
    right: 100%;
    left: auto;
    bottom: 10%;
    top: auto;
}

.tooltip-container:hover .tooltiptext {
    visibility: visible;
    opacity: 1;
}

.tooltiptext:focus,
.tooltiptext:active {
    visibility: hidden;
    opacity: 0;
}

/* Rotate the arrow for the tooltip's various positions */
.tooltiptext[data-avoid-crop-position="top"]::after {
    top: auto;
    bottom: 100%;
    transform: rotate(0deg);
    border-color: transparent transparent var(--tooltip-border-color) transparent;
}

.tooltiptext[data-avoid-crop-position="top-left"]::after {
    top: 100%;
    transform: rotate(0deg);
    right: 8px;
    left: calc(100% - 13px);
}

.tooltiptext[data-avoid-crop-position="left"]::after {
    top: calc(50% - 5px);
    transform: rotate(90deg);
    border-color: transparent transparent var(--tooltip-border-color) transparent;
    left: 103%;
}

.tooltiptext[data-avoid-crop-position="bottom-left"]::after {
    top: 50%;
    transform: rotate(90deg);
    border-color: transparent transparent var(--tooltip-border-color) transparent;
    left: 103%;
}
</style>
