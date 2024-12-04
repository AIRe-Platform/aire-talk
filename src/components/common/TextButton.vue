<!--
    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at https://mozilla.org/MPL/2.0/.
-->

<script setup lang="ts">
import { defineEmits } from "vue";

const emits = defineEmits<{
    click: []
}>();
</script>

<template>
    <a class="text-button" href="#" @keydown.space="emits('click')" @click="emits('click')">
        <slot></slot>
    </a>
</template>

<style lang="scss" scoped>
.text-button {
    text-decoration: none;
    cursor: pointer;
    color: var(--text-color);
    transition: color 0.5s;
    margin: 0.1rem -0.5rem;
    padding: 0.5rem;

    &:hover {
        color: var(--hover-text);
    }

    &:focus-visible {
        outline: 2px solid;
        outline-offset: 2px;
    }
}
</style>
