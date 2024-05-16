<script setup lang="ts">
import { UISettings } from '@/context/ui';
import { defineProps } from 'vue';
const props = defineProps<{
    open: boolean
}>()
</script>

<template>
    <div class="options-button"
        :class="{ 'options-button-active': props.open, 'options-button-fake-small-screen': UISettings.screenSize == 'mobile-screen' }"
        v-if="props.open">

        <div class="icon close-window">
        </div>

    </div>
</template>

<style scoped>
.options-button {
    position: absolute;
    align-items: center;
    justify-content: center;

    padding: 0.5rem;
    right: 2.5rem;
    top: 1.5rem;
    width: 0rem;
    height: 1rem;
    z-index: 3;

    /* background-color: var(--panel-background-color); */
    border-radius: 1rem;

    transition: color .2s;
    cursor: pointer;

    &:hover {
        color: var(--accent-primary-color);
    }
}

.options-button-fake-small-screen {
    top: 4rem;
    right: 3rem;
    transform: scale(0.7);
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
