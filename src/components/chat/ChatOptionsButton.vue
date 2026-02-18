<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->

<script setup lang="ts">
const props = defineProps<{
    open: boolean
}>()
</script>

<template>
    <div class="options-button" :class="{ 'options-button-active': props.open }" v-if="props.open">
        <font-awesome-icon icon="fa-solid fa-xmark" />
    </div>
</template>

<style lang="scss" scoped>
.options-button {
    position: absolute;
    align-items: center;
    justify-content: center;

    padding: 0.5rem;
    right: 2.5rem;
    top: 1.5rem;
    width: 0rem;
    height: 1rem;

    /* background-color: var(--panel-background-color); */
    border-radius: 1rem;

    transition: color .2s;
    cursor: pointer;

    &:hover {
        color: var(--hover-text);
    }
}

.options-button-active {
    color: var(--accent-primary-color);
}

@media screen and ((max-aspect-ratio: 1/1) or (max-width: 920px)) {
    .options-button {
        display: flex;
        border: none;
        box-shadow: unset;
        width: 1rem;
        right: 1rem;
    }
}
</style>
