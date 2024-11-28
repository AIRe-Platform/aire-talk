<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->

<script setup lang="ts">
import { computed, defineEmits, defineProps, onMounted, onUnmounted, ref } from 'vue';
import Modal from '@/components/common/Modal.vue';
import { LocalizationKey } from '@/locales/keys';

const buttonsRef = ref<HTMLElement | null>(null);
const emit = defineEmits<{
    // eslint-disable-next-line no-unused-vars
    (e: 'select', index: number): void;
    // eslint-disable-next-line no-unused-vars
    (e: 'focusFirstButton', element: HTMLElement | null): void;
    // Emits the 'active' event with a boolean value
    (e: 'active', isActive: boolean): void;
}>()

let observer: IntersectionObserver | undefined;

const props = defineProps<{
    active: boolean,
    buttons: Array<{ loc_key: LocalizationKey, className?: string, onClick?: () => void }>;
    showCloseButton?: boolean;
}>();


const emitSelect = (i: number) => {
    const button = props.buttons[i];
    if (button.onClick) {
        button.onClick();
    }
    emit('select', i);
}

const hasButtons = computed(() => props.buttons.length > 0);

onMounted(() => {
    if (buttonsRef.value) {
        observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    emit('focusFirstButton', buttonsRef.value?.children[0] as HTMLElement);
                }
            });
        });
        observer.observe(buttonsRef.value);
    }
});

const handleClose = () => {
    emit('active', false);
};

onUnmounted(() => observer?.disconnect());

const switchButtonFocus = (next: boolean, index: number) => {
    const buttons = buttonsRef.value?.querySelectorAll('button');
    if (!buttons) return;
    const nextIndex = (index + (next ? 1 : -1) + buttons.length) % buttons.length;
    buttons[nextIndex].focus();
}

</script>

<template>
    <Modal :active="props.active" :show-close-button="props.showCloseButton" @close="handleClose">
        <div class="dialog-question">
            <slot></slot>
        </div>
        <div v-if="hasButtons" class="dialog-buttons" ref="buttonsRef">
            <button class="btn" v-for="(btn, i) in props.buttons" @click.stop="emitSelect(i)"
                :key="`dialog-button-${i}`" @keydown.prevent.tab.exact="switchButtonFocus(true, i)"
                @keydown.prevent.shift.tab="switchButtonFocus(false, i)" :class="btn.className">
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