<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->
<script setup lang="ts">
import { reactive } from 'vue';
import LanguageSelector from "@/components/settings/LanguageSelector.vue";
import Modal from '../common/Modal.vue';
import { l } from '@/locales';

const state = reactive<{
    isVisible: boolean
}>({
    isVisible: true,
});

const closeModal = () => { state.isVisible = false; }

</script>

<template>
    <Modal :active="state.isVisible" :showCloseButton="true" @close="closeModal">
        <div class="popup-content">
            <h2>{{ $t(l.Language_default_message) }}</h2>
            <LanguageSelector @languageSelected="state.isVisible = false" :blank-option="$t(l.tooltip_menu_language)"/>
        </div>
    </Modal>
</template>

<style lang="scss" scoped>
.popup-content {
    display: flex;
    flex-direction: column;
    padding: 2rem;
    gap: 3rem;
}

@media screen and (max-width: 320px) {
    .popup-content {
        padding-inline: 0;
    }
}
</style>
