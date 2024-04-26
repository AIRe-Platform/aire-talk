<script setup lang="ts">
import { defineEmits } from 'vue';
import { l } from '@/locales';
import PopUp from './PopUp.vue';

defineEmits<{
    accept: [],
    decline: [],

}>()

const props = defineProps<{
    hideDecline?: boolean,
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
                    {{ $t(l.button_accept) }}
                </button>
                <button v-if="!hideDecline" class="popup-button-cancel" @click.stop="() => $emit('decline')">
                    {{ $t(l.button_cancel) }}
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
    font-size: var(--font-medium);
    font-family: var(--font-family);
}

.popup-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 3rem;
}
</style>