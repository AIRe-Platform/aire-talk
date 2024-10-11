<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->

<script setup lang="ts">
import { computed, defineEmits, defineProps } from 'vue';
import Modal from '@/components/common/Modal.vue';
import { LocalizationKey } from '@/locales/keys';


const emit = defineEmits<{
    (e: 'select', index: number): void;
}>()

const props = defineProps<{
    buttons: Array<{ loc_key: LocalizationKey, className?: string, onClick?: () => void }>
}>()

const emitSelect = (i: number) => {
    const button = props.buttons[i];
    if (button.onClick) {
        button.onClick();
    }
    emit('select', i);
}

const hasButtons = computed(() => props.buttons.length > 0);
</script>

<template>
    <Modal :active="true">
        <div class="dialog-question">
            <slot></slot>
        </div>
        <div v-if="hasButtons" class="dialog-buttons">
            <button v-for="(btn, i) in props.buttons" @click.stop="emitSelect(i)" :key="`dialog-button-${i}`"
                :class="btn.className">
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
    justify-content: space-evenly;
    gap: 1rem;
    flex-wrap: wrap;
    margin-top: 3rem;
}

.cancel-button {
    background-color: var(--delete-color);
}
</style>