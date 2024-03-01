<script setup lang="ts">
import { defineProps, defineEmits, defineComponent } from "vue";
defineComponent({ name: "SwitchComponent" });

const props = defineProps({
    isOn: {
        required: true,
        type: Boolean,
    },
});

defineEmits<{
    change: [value: boolean];
}>();
</script>

<template>
    <div class="switch" @click="$emit('change', !props.isOn)">
        <div class="switch-handle" :class="{ 'switch-handle-on': props.isOn }"></div>
    </div>
</template>

<style scoped>
.switch {
    display: flex;
    flex-direction: column;
    justify-content: center;
    cursor: pointer;

    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    background-color: var(--border-color);

    margin: 0.5rem;
    height: 1rem;
    flex-grow: 1;

    &:hover {
        .switch-handle {
            background-color: var(--accent-primary-color);
        }
    }
}

.switch-handle {
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    background-color: var(--panel-background-color);
    position: relative;
    width: 45%;
    height: 100%;
    left: 0;
    transition:
        background-color 0.25s,
        left 0.25s;
}

.switch-handle-on {
    left: calc(100% - 45% - 2px)
}
</style>
