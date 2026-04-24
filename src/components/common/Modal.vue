<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->

<script setup lang="ts">
import { defineComponent } from 'vue';
import Panel from '@/components/common/Panel.vue'
import { l } from '@/locales';
import Tooltip from "@/components/common/Tooltip.vue";

const props = defineProps<{
    active: boolean
    showCloseButton?: boolean,
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
                    <Tooltip v-if="props.showCloseButton" :text="$t(l.tooltip_close)" position="top" class="xmark-icon">
                        <button class="tooltip-inside circle-icon" :aria-label=$t(l.tooltip_close) @click="close">
                            <font-awesome-icon icon="fa-solid fa-xmark" />
                        </button>
                    </Tooltip>
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

    -webkit-backdrop-filter: blur(2px);
    backdrop-filter: blur(2px);
}

.xmark-icon {
    display: flex;
    justify-content: flex-end;
    align-items: flex-start;
    padding-bottom: 0.5rem;
}

.tooltip-inside {
    height: 2rem;
    width: 2rem;
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
    display: flex;
    align-items: stretch;
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