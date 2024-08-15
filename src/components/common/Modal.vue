// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

<script setup lang="ts">
import { defineEmits, defineComponent, defineProps } from 'vue';
import Panel from '@/components/common/Panel.vue'

const props = defineProps<{
    active: boolean
    showCloseButton?: boolean
}>();

const emits = defineEmits<{
    close: []
}>();

const close = () => {
    emits('close')
}

defineComponent({ name: "ModalComponent" })
</script>

<template>
    <Transition name="modal-animation">
        <div v-show="props.active" class="modal" @click.stop="close">
            <Transition name="modal-animation-panel">
                <Panel class="modal-panel" @click.stop>
                    <div class="icon close-window modal-close" @click.stop="close" v-if="props.showCloseButton"></div>
                    <div class="modal-content">
                        <slot></slot>
                    </div>
                </Panel>
            </Transition>
        </div>
    </Transition>
</template>

<style scoped>
.modal {
    display: flex;
    align-items: center;
    justify-content: center;

    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 9001;

    backdrop-filter: blur(2px);
}

.modal-panel {
    display: flex;
    flex-direction: column;
    position: absolute;
    padding: 1rem;
    max-width: 80dvw;
    max-height: 80dvh;
}

.modal-close {
    position: absolute;
    top: 0.6rem;
    right: 0.6rem;
    z-index: 9002;
}

.modal-content {
    overflow-x: auto;
    overflow-y: auto;
}

.modal-animation-enter-active,
.modal-animation-leave-active {
    transition: opacity 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}

.modal-animation-enter-from,
.modal-animation-leave-to {
    opacity: 0;
}

.modal-animation-panel-enter-active {
    transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02) 0.15s;
}

.modal-animation-panel-leave-active {
    transition: all 0.3s cubic-bezier(0.52, 0.02, 0.19, 1.02);
}

.modal-animation-panel-enter-from {
    opacity: 0;
    transform: scale(0.8);
}

.modal-animation-panel-leave-to {
    transform: scale(0.8);
}
</style>