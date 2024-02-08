<script setup lang="ts">
import { defineEmits } from 'vue';
import { l } from '@/locales';
import PopUp from './PopUp.vue';

defineEmits<{
    accept: [],
    decline: []
}>()

</script>

<template>
    <PopUp>
        <div class="popup-content">
            <div class="popup-question">
                <slot></slot>
            </div>
            <div class="popup-buttons">
                <button class="popup-button-accept" @click.stop="() => $emit('accept')">
                    <a class="nav-link" href="#"> {{ $t(l.button_accept) }} </a>
                </button>
                <button class="popup-button-cancel" @click.stop="() => $emit('decline')">
                    <a class="nav-link" href="#"> {{ $t(l.button_cancel) }} </a>
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