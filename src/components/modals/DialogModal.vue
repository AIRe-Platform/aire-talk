<script setup lang="ts">
import { defineEmits, defineProps } from 'vue';
import { LocalizationKey } from '@/locales';
import Modal from '@/components/common/Modal.vue';

defineEmits<{
    select: [number]
}>()

const props = defineProps<{
    buttons: Array<{ loc_key: LocalizationKey }>
}>()

</script>

<template>
    <Modal @on-close.stop>
        <div class="dialog-question">
            <slot></slot>
        </div>
        <div class="dialog-buttons">
            <button v-for="btn, i in props.buttons" @click.stop="() => $emit('select', i)" :key="`dialog-button-${i}`">
                {{ $t(btn.loc_key) }}
            </button>
        </div>
    </Modal>
</template>

<style lang="scss" scoped>
.dialog-question {
    font-size: var(--font-medium);
    font-family: var(--font-family);
}

.dialog-buttons {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
    margin-top: 3rem;
}
</style>