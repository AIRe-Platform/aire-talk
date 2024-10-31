<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->
<script setup lang="ts">
import { supportedLocales, setUILanguage, l } from "@/locales";
import ISO6391, { LanguageCode } from 'iso-639-1';
import { defineEmits } from 'vue';

const emit = defineEmits(['languageSelected']);

const setLang = async (e: Event) => {
    const el = e.target as HTMLSelectElement;
    setUILanguage(el.value as LanguageCode);
    el.blur();

    // Emit event to parent
    emit('languageSelected');
};
</script>

<template>
    <div class="language-selector-panel">
        <label for="settings-language">{{ $t(l.settings_language) }}</label>
        <div class="tooltip">
            <select id="settings-language" class="capitalize" @change="setLang" :value="$i18n.locale">
                <option v-for="lang in supportedLocales" :value="lang" :key="lang">
                    {{ $t(lang) }} ({{ ISO6391.getName(lang) }})
                </option>
            </select>
            <span class="tooltiptext">{{ $t(l.tooltip_menu_language) }}</span>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.language-selector-panel {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.tooltip {
    display: flex;
    max-width: 12rem;
}

#settings-language {
    max-width: -webkit-fill-available;
}

@media screen and ((max-aspect-ratio: 1/1) or (max-width: 520px)) {
    #settings-language {
        width: 100%;
    }

    .tooltip {
        max-width: none;
    }
}
</style>