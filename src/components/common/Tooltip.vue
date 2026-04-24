<!--
    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at https://mozilla.org/MPL/2.0/.
-->

<script setup lang="ts">
import { useTooltip, TooltipPosition } from '@/context/tooltip';
import { compile, computed, defineComponent, onBeforeUnmount, onMounted, onUnmounted, useTemplateRef } from 'vue';

defineComponent({ name: "TooltipInjector" })

const props = defineProps<{
    text?: string,
    position: TooltipPosition
}>();

const wrapper = useTemplateRef<HTMLElement>("el");
const element = computed(() => wrapper.value?.children.item(0) as HTMLElement);
const tooltip = useTooltip();

onMounted(() => {
    if (element.value && props.text)
        tooltip.register(element.value, props.text, props.position);
    else
        console.warn("Failed to register tooltip", props.text);
});

onBeforeUnmount(() => {
    if (tooltip.getActiveElement() === element.value)
        tooltip.clear();
});
</script>

<template>
    <div class="tooltip-wrapper" ref="el">
        <slot></slot>
    </div>
</template>

<style lang="css" scoped>
.tooltip-wrapper {
    display: contents;
}
</style>
