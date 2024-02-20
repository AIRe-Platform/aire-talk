<script setup lang="ts">
import { Theme, setTheme } from "@/context/theme";
import { defineProps, defineEmits } from "vue";

const props = defineProps({
    modelValue: {
        required: true,
        type: Boolean,
    },
    label_left: String,
    label_right: String,
});

const emit = defineEmits(["update:modelValue"]);

const toggle = () => {
    emit("update:modelValue", !props.modelValue);
    toggleTheme();
};

const toggleTheme = () => {
    if (Theme.style === "theme-dark") {
        setTheme("theme-default");
    } else {
        setTheme("theme-dark");
    }
};
</script>

<template>
    <div class="toggle-switch-container">
        <div class="toggle-switch-labels">
            <div class="toggle-switch-label-left">
                {{ label_left }}
            </div>
            <div class="toggle-switch-label-right">
                {{ label_right }}
            </div>
        </div>
        <div
            class="toggle-switch"
            :class="{ checked: modelValue }"
            @click="toggle"
        />
    </div>
</template>

<style scoped>
.toggle-switch-container {
    display: flex;
    flex-direction: column;
    align-self: center;
    width: 15rem;
}
.toggle-switch-labels {
    display: flex;
    justify-content: space-between;
    width: 100%;
}
.toggle-switch-label-left {
    justify-content: flex-start;
}
.toggle-switch-label-right {
    justify-content: flex-end;
}
.toggle-switch {
    background: var(--border-color);
    border-radius: 0.75em;
    box-shadow: 0.0625em 0.0625em 0.0625em rgba(0, 0, 0, 0.08) inset;
    cursor: pointer;
    flex: none;
    height: 1.5em;
    position: relative;
    transition: background-color 150ms;
    width: 100%;
}

.toggle-switch::before {
    background: var(--background-color);
    background-image: radial-gradient(
        circle at 0.375em 0.375em,
        rgba(0, 0, 0, 0) 0,
        rgba(0, 0, 0, 0.05) 1em
    );
    border-radius: 0.625em;
    box-shadow: 0.0625em 0.0625em 0.0625em rgba(0, 0, 0, 0.08);
    content: "";
    display: block;
    height: 1.25em;
    left: 10.125em;
    position: absolute;
    top: 0.125em;
    transition: left 150ms;
    width: 3.25em;
    will-change: left;
}

.checked {
    background-color: var(--border-color);
}

.checked::before {
    background-image: radial-gradient(
        circle at 0.375em 0.375em,
        rgba(0, 0, 0, 0) 0,
        rgba(0, 0, 0, 0.05) 1em
    );
    left: 1.625em;
}

.toggle-switch:hover {
    box-shadow: 0.0625em 0.0625em 0.125em rgba(0, 0, 0, 0.12) inset;
}

.toggle-switch:hover::before {
    background-image: radial-gradient(
        circle at 0.375em 0.375em,
        rgba(0, 0, 0, 0) 0,
        rgba(0, 0, 0, 0.0375) 1em
    );
    box-shadow: 0.0625em 0.0625em 0.0625em rgba(0, 0, 0, 0.12);
}
</style>
