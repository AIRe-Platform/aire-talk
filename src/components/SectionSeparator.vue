<script setup lang="ts">
</script>

<template>
    <svg class="section-separator">
        <line x1="8" y1="00" x2="100%" y2="00" />
    </svg>
</template>

<style scoped>
.section-separator {
    border: 0;
    height: 2px;
    margin: 0.5rem;
    
    stroke: var(--dividers);
    stroke-width: 4px;
    stroke-dasharray: 2, 15;
    align-self: stretch;
}
</style>
