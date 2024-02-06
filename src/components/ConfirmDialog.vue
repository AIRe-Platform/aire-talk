<script setup lang="ts">
import { defineEmits } from 'vue';
import { l } from '@/locales';
import PopUp from './PopUp.vue';

defineEmits<{
    accept: [e: Event],
    decline: [e: Event]
}>()

</script>

<template>
    <PopUp>
        <div class="popup-content">
            <div class="popup-question">
                <slot></slot>
            </div>
            <div class="popup-buttons">
                <button class="popup-button-accept" @click="(e: Event) => $emit('accept', e)">
                    <a class="nav-link" href="#"> {{ $t(l.popup_button_accept) }} </a>
                </button>
                <button class="popup-button-cancel" @click="(e: Event) => $emit('decline', e)">
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