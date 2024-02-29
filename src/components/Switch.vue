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
        <div
            class="switch-handle"
            :class="{ 'switch-handle-on': props.isOn }"
        ></div>
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
    width: 45%;
    height: 100%;
    transition: background-color 0.25s;

    /* align-self: flex-start; */
    animation: slide-in 0.5s forwards;
    -webkit-animation: slide-in 0.5s forwards;
}

.switch-handle-on {
    /* align-self: flex-end; */
    animation: slide-out 0.5s forwards;
    -webkit-animation: slide-out 0.5s forwards;
}

@keyframes slide-in {
    0% {
        margin-left: calc(100% - 4.2rem);
    }
    100% {
        margin-left: 0rem;
    }
}

@-webkit-keyframes slide-in {
    0% {
        margin-left: calc(100% - 4.2rem);
    }
    100% {
        margin-left: 0rem;
    }
}

@keyframes slide-out {
    0% {
        margin-left: 0rem;
    }
    100% {
        margin-left: calc(100% - 4.2rem);
    }
}

@-webkit-keyframes slide-out {
    0% {
        margin-left: 0rem;
    }
    100% {
        margin-left: calc(100% - 4.2rem);
    }
}

@media screen and (max-width: 600px) {
    @keyframes slide-in {
        0% {
            margin-left: calc(100% - 8.2rem);
        }
        100% {
            margin-left: 0rem;
        }
    }

    @-webkit-keyframes slide-in {
        0% {
            margin-left: calc(100% - 8.2rem);
        }
        100% {
            margin-left: 0rem;
        }
    }

    @keyframes slide-out {
        0% {
            margin-left: 0rem;
        }
        100% {
            margin-left: calc(100% - 45.4%);
        }
    }

    @-webkit-keyframes slide-out {
        0% {
            margin-left: 0rem;
        }
        100% {
            margin-left: calc(100% - 45.4%);
        }
    }
}
</style>
