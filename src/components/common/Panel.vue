<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->

<script setup lang="ts">
import { defineComponent } from 'vue';
defineComponent({ name: "PanelComponent" })
</script>

<template>
    <div class="panel">
        <slot></slot>
    </div>
</template>

<style lang="scss" scoped>
.panel {
    background-color: var(--panel-menu-background-color);
    border-radius: 1rem;
    border: 1px solid var(--panel-border-color);
    margin: 1rem;
}
</style>