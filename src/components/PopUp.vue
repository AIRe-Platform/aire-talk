<script setup lang="ts">
import Panel from './Panel.vue';
</script>

<template>
    <div class="popup-overlay">
        <Panel class="popup-panel" @click.stop="">
            <slot></slot>
        </Panel>
    </div>
</template>

<style scoped>
.popup-overlay {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;

    z-index: 9001;
    padding: 1rem;

    display: flex;
    align-items: center;
    justify-content: center;

    background: var(--overlay-color);
}

.popup-panel {
    display: flex;
}
</style>
