<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->

<script setup lang="ts">
import { computed, defineEmits, defineProps, onMounted, onUnmounted, ref } from 'vue';
import Modal from '@/components/common/Modal.vue';
import { LocalizationKey } from '@/locales/keys';
import { switchFocus } from '@/helpers/keyboarNavigation';

const buttonsRef = ref<HTMLElement | null>(null);
const dialogModalRef = ref<HTMLElement | null>(null);
const emit = defineEmits<{
    select: [index: number];
    focusFirstButton: [element: HTMLElement | null]
    // Emits the 'active' event with a boolean value
    active: [isActive: boolean];
}>()

let observer: IntersectionObserver | undefined;

const props = defineProps<{
    active: boolean;
    buttons: Array<{ loc_key: LocalizationKey, className?: string, onClick?: () => void }>;
    showCloseButton?: boolean;
    questionId?: string;
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
</script>

<template>
    <div ref="dialogModalRef" @keydown.prevent.tab.exact="switchFocus(true, dialogModalRef)"
        @keydown.prevent.shift.tab="switchFocus(false, dialogModalRef)">
        <Modal :active="props.active" :show-close-button="props.showCloseButton" @close="handleClose">
            <div class="dialog-question" :id="props.questionId">
                <slot></slot>
            </div>
            <div v-if="hasButtons" class="dialog-buttons" ref="buttonsRef">
                <button class="btn" v-for="(btn, i) in props.buttons" @click.stop="emitSelect(i)" :key="`dialog-button-${i}`"
                    :aria-describedby="props.questionId"
                    :class="btn.className">
                    {{ $t(btn.loc_key) }}
                </button>
            </div>
        </Modal>
    </div>
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