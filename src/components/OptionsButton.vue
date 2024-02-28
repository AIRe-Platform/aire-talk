<script setup lang="ts">
import { defineProps } from 'vue';
const props = defineProps<{
    open: boolean
}>()
</script>

<template>
    <div class="options-button" :class="{ 'options-button-active': props.open }">
        <div class="options-icon">
            <font-awesome-icon icon="fa-solid fa-sliders" />
        </div>
    </div>
</template>

<style scoped>
.options-button {
    display: none;
    position: absolute;

    padding: 0.5rem;
    right: 0.5rem;
    top: 0.5rem;
    width: 2.2rem;
    height: 2rem;
    z-index: 1;

    background-color: var(--panel-background-color);
    border-radius: 1rem;
    border: 1px solid var(--border-color);
    box-shadow: 0 0 5px var(--shadow-color);
    transition: color .2s;
    cursor: pointer;

    &:hover {
        color: var(--accent-primary-color);
    }
}

.options-button-active {
    color: var(--accent-primary-color);
}

.options-icon {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 40px;
    height: 30px;

    * {
        height: 80%;
    }
}

@media screen and (max-width: 600px) {
    .options-button {
        display: flex;
        border: none;
        box-shadow: unset;
    }
}
</style>
