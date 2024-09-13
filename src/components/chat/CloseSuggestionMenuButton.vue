<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { ref } from "vue";

const props = defineProps<{
    menuOpen: boolean
}>()

const isClosingMenu = ref(false);

const emit = defineEmits<{
    toggleMenuOpen: []
}>()

const handleClick = async () => {
    isClosingMenu.value = true;
    setTimeout(() => {
        emit('toggleMenuOpen');
    }, 150);
}
</script>

<template>
    <div class="close-summary-menu-button " :class="{ 'button-active': props.menuOpen }" v-show="props.menuOpen"
        @click="handleClick">
        <div class="icon close-window"></div>
    </div>
</template>

<style lang="scss" scoped>
.close-summary-menu-button {

    display: flex;
    height: 1rem;
    cursor: pointer;
    align-items: flex-end;
    flex-direction: column;

    &:hover {
        color: var(--accent-primary-color);
    }
}

.button-active {
    color: var(--accent-primary-color);
    right: 1.5rem;
}

@media screen and ((max-aspect-ratio: 1/1) or (max-width: 920px)) {
    .close-summary-menu-button {
        display: flex;
        border: none;
        box-shadow: unset;
        width: 1rem;
        right: 2rem;
    }
}
</style>