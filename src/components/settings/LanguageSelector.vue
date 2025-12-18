<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->
<script setup lang="ts">
import { supportedLocales, setUILanguage, l } from "@/locales";
import ISO6391, { LanguageCode } from 'iso-639-1';
import Tooltip from "@/components/common/Tooltip.vue";

const emit = defineEmits(['languageSelected']);

const props = defineProps<{
    blank?: string,
    hideLabel?: boolean
}>();

const setLang = async (e: Event) => {
    const el = e.target as HTMLSelectElement;
    setUILanguage(el.value as LanguageCode);

    // Emit event to parent
    emit('languageSelected');
};

</script>

<template>
    <div class="language-selector-panel">
        <label for="settings-language" v-if="!props.hideLabel">{{ $t(l.settings_language) }}</label>
        <Tooltip :text="$t(l.tooltip_menu_language)" position="top" :useMaxContent="false" :adjustPosition="true">
            <select id="settings-language" class="capitalize" @change="setLang" :value="!props.blank ? $i18n.locale : ''">
                <option v-if="props.blank" value="" disabled hidden> {{ props.blank }} </option>
                <option v-for="lang in supportedLocales" :value="lang" :key="lang">
                    {{ $t(lang) }} ({{ ISO6391.getName(lang) }})
                </option>
            </select>
        </Tooltip>

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