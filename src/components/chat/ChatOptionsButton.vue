<script setup lang="ts">
import { defineProps } from 'vue';
const props = defineProps<{
    open: boolean
}>()
</script>

<template>
    <div class="options-button" :class="{ 'options-button-active': props.open }" v-if="props.open">
        <div class="icon close-window"></div>
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
        color: var(--accent-primary-color);
    }
}

.options-button-active {
    color: var(--accent-primary-color);
}

.ui-mode-mobile {
    .options-button {
        display: flex;
        border: none;
        box-shadow: unset;
        width: 1rem;
        right: 1rem;
    }
}
</style>
