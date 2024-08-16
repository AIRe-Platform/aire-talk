<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->

<script setup lang="ts">
import { defineComponent } from "vue";
defineComponent({ name: "SeparatorComponent " });
</script>

<template>
    <svg class="separator">
        <line x1="8" y1="00" x2="100%" y2="00" />
    </svg>
</template>

<style scoped>
.separator {
    border: 0;
    height: 2px;
    margin: 0.5rem;

    stroke: var(--dividers);
    stroke-width: 4px;
    stroke-dasharray: 2, 15;
    align-self: stretch;
}
</style>
