<!--
    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at https://mozilla.org/MPL/2.0/.
-->

<script setup lang="ts">
import { UIState } from '@/context/ui';
import Tooltip from '../common/Tooltip.vue';

// eslint-disable-next-line no-undef
const props = defineProps<{
    label: string,
    icon?: string,
    tooltip?: string,
}>();

// create the new key from the label, with lower case all and replacing spaces with _
function formatTooltipKey(tooltip: string): string {
    return 'tooltip_' + tooltip;
}
</script>

<template>
    <div v-if="props.icon || UIState.isNavMenuCompressed" :class="['icon ' + props.icon]">
    </div>
    <Tooltip v-if="props.tooltip" :text=$t(formatTooltipKey(props.tooltip)) position="bottom" :useMaxContent="false"
        :adjustPosition="false">
        <div class="nav-link">
            {{ props.label }}
        </div>
    </Tooltip>
    <div v-else class="nav-link">
        {{ props.label }}
    </div>
</template>

<style lang="scss" scoped>
.nav-link {
    color: var(--text-color);
}

@media screen and ((max-aspect-ratio: 1/1) or (max-width: 920px)) {
    .short-nav-menu .nav-link {
        display: none;
        width: 0;
        height: 0;
    }
}
</style>
