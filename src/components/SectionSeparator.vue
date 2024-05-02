<script setup lang="ts">
</script>

<template>
    <svg class="section-separator">
        <line x1="00" y1="00" x2="100%" y2="00" />
    </svg>
</template>

<style scoped>
.section-separator {
    border: 0;
    height: 1rem;
    padding: 1rem;
    margin: 1rem;
    stroke: var(--dividers);
    stroke-width: 4px;
    stroke-dasharray: 2, 15;
    align-self: stretch;
}
</style>
