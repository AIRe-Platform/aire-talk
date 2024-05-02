<script setup lang="ts">
import { defineProps } from 'vue';
const props = defineProps<{
    open: boolean
}>()
</script>

<template>
    <div class="options-button" :class="{ 'options-button-active': props.open }" v-if="props.open">

        <div class="xmark-icon">
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

    background-color: var(--panel-background-color);
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

.xmark-icon {
    background-image: url(/src/assets/icons/aire-icon-xmark.svg);
    width: 1.5rem;
    height: 1.5rem;
    background-size: cover;
    position: absolute;

}

@media screen and ((max-aspect-ratio: 1/1) or (max-width: 920px)) {
    .options-button {
        display: flex;
        border: none;
        box-shadow: unset;
    }
}
</style>
