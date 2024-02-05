<script setup lang="ts">
import { defineProps } from 'vue';
import { l } from '@/locales';
import PopUp from './PopUp.vue';

const props = defineProps<{
    accept: () => void
    decline: () => void
}>()

</script>

<template>
    <PopUp>
        <div class="popup-content">
            <div class="popup-question">
                <slot></slot>
            </div>
            <div class="popup-buttons">
                <button class="popup-button-accept" @click="props.accept">
                    <a class="nav-link" href="#"> {{ $t(l.popup_button_accept) }} </a>
                </button>
                <button class="popup-button-cancel" @click="props.decline">
                    <a class="nav-link" href="#"> {{ $t(l.popup_button_cancel) }} </a>
                </button>
            </div>
        </div>
    </PopUp>
</template>

<style scoped>
.popup-content {
    padding: 2rem;
}

.popup-question {
    font-size: small;
    font-family: var(--font-family);
}

.popup-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 3rem;
}
</style>