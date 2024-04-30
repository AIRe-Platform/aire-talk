<script setup lang="ts">
import { defineComponent } from 'vue';
defineComponent({ name: "PanelComponent" })
</script>

<template>
    <div class="panel">
        <slot></slot>
    </div>
</template>

<style scoped>
.panel {
    background-color: var(--panel-menu-background-color);
    border-radius: 1rem;
    border: 1px solid var(--panel-border-color);
    margin: 1rem;
}
</style>