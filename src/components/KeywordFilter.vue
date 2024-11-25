<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->
<script setup lang="ts">
import { getUILanguage } from '@/locales';
import { AireKeyword } from 'aire';
import { defineProps, defineEmits, computed } from 'vue';

// Define the props interface
const props = defineProps<{
    keywords: AireKeyword[]; // All available keywords
    selectedKeywords: AireKeyword[]; // Initially selected keywords
}>();

// Emit function to send changes to parent
const emit = defineEmits<{
    (e: 'update:selectedKeywords', selected: AireKeyword[]): void; // Emit event when selection changes
}>();

// Helper to check if keyword is selected
const isSelected = (keyword: AireKeyword) => {
    return props.selectedKeywords.some(selected => selected.value === keyword.value);
};

// Toggle selected keywords
const toggleKeyword = (keyword: AireKeyword) => {
    const newSelected = [...props.selectedKeywords];

    if (isSelected(keyword)) {
        // Deselect keyword by filtering it out
        emit('update:selectedKeywords', newSelected.filter(k => k.value !== keyword.value));
    } else {
        // Select keyword by adding it
        newSelected.push(keyword);
        emit('update:selectedKeywords', newSelected);
    }
};
const translatedKeywords = computed(() => {
    const langID = getUILanguage().value;  // Get the current UI language ID
    return props.keywords?.map(keyword => {
        const translation = keyword.translations?.find(t => t.languageID === langID);
        return {
            ...keyword,
            displayValue: translation ? translation.value : keyword.value // Add translated text as 'displayValue'
        };
    }) || [];
});
</script>

<template>
    <div class="keyword-selector">
        <!-- Display keywords that can be clicked to select/deselect -->
        <div class="keywords-list">
            <button class="btn" v-for="keyword in translatedKeywords" :key="keyword.value"
                :class="['keyword-button', { selected: isSelected(keyword) }]" @click="toggleKeyword(keyword)">
                {{ keyword.displayValue }}
            </button>
        </div>
    </div>
</template>

<style scoped>
.keyword-selector {
    padding: 1rem;
    overflow: auto;
    border-radius: 8px;
}

.keywords-list {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
}

.keyword-button {
    padding: 0.5rem;
    margin: 0.25rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    background-color: var(--question-background);
    color: var(--basic-text);
}

.keyword-button.selected {
    background-color: var(--button-color);
}

.selected-keywords {
    margin-top: 1rem;
}

.selected-keywords ul {
    list-style-type: none;
    padding-left: 0;
}

.selected-keywords li {
    margin: 0.25rem 0;
    font-style: italic;
}

@media screen and (max-width: 715px) {
    .keyword-selector {
        padding: 1rem;
        border-radius: 8px;
    }
}
</style>