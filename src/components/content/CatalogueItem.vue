<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->

<script setup lang="ts">
import Panel from '@/components/common/Panel.vue';
import { defineProps, defineEmits, computed } from "vue";
import { AireContentType, AireContent } from 'aire';
import { l } from '@/locales';
import Tooltip from '../common/Tooltip.vue';

const props = defineProps<{
    content: AireContent,
    isFromSummary: boolean
}>();

// Function to normalize the rating
const normalizeRating = (rating: number, min: number = 1, max: number = 3): number => {
    // Assuming your original ratings are between 0 and some max value
    const originalMin = 0;
    const originalMax = 10; // Adjust this depending on your highest possible rating score

    // Normalize the rating between min and max (1 and 3 in this case)
    return Math.max(min, Math.min(max, ((rating - originalMin) / (originalMax - originalMin)) * (max - min) + min));
};
// Normalize the rating between 1 and 3 stars
const normalizedRating = computed(() => normalizeRating(props.content.score || 0));

defineEmits<{
    show: [AireContent];
}>();

const isAireContentType = (value: any): value is AireContentType => Object.values(AireContentType).includes(value);

const getIconClass = (type: AireContentType | undefined): string => {
    const result = isAireContentType(type) ? `content-${type}` : '';
    return result;
};
</script>

<template>
    <Panel>
        <button type="button" @click="$emit('show', props.content)" class="catalogue-item no-style"
            :class="{ 'is-from-summarycontent': props.isFromSummary }"
            :aria-label="`${$t(l.screen_recorder_open_content)} ${props.content.name || $t(l.screen_recorder_content_item)}`">
            <div class="catalogue-item-header">
                <div v-if="props.content.modified" role="text" tabindex="0"
                    :aria-label=$t(l.screen_recorder_content_published)>
                    {{ new Date(props.content.modified).toLocaleString($i18n.locale) }}
                </div>
                <Tooltip :text="`${$t(l.screen_recorder_content_type)} ${props.content.type}`">
                    <div :class="getIconClass(props.content.type)" class="icon" tabindex="0"
                        :aria-label="`${$t(l.screen_recorder_content_type)} ${props.content.type}`"></div>
                </Tooltip>
            </div>
            <div class="catalogue-item-media" tabindex="0" :aria-label=$t(l.screen_recorder_content_media)>
                <video muted class="video" v-if="props.content.type == AireContentType.Video">
                    <source v-if="props.content.id" :src="props.content.url + '#t=5'" :key="props.content.url"
                        type="video/mp4">
                </video>
                <img :src="props.content.url" class="image"
                    :alt="props.content.name || $t(l.screen_recorder_image_content)"
                    v-else-if="props.content.type == AireContentType.Image">
                <template v-else-if="props.content.type == AireContentType.URL">
                    <div class="icon content-url catalogue-item-width-icon" v-if="!props.content.thumbnail_url"></div>
                    <div v-else class="div-thumbnail">
                        <img class="thumbnail" :src="props.content.thumbnail_url"
                            :alt="$t(l.screen_recorder_thumbnail)" />
                    </div>
                </template>
                <template v-else-if="props.content.type == AireContentType.Document">
                    <div class="icon content-document catalogue-item-width-icon" v-if="!props.content.thumbnail_url"
                        aria-label="Document preview">
                    </div>
                    <div v-else class="div-thumbnail">
                        <img class="thumbnail" :src="props.content.thumbnail_url"
                            :alt="$t(l.screen_recorder_thumbnail)" />
                    </div>
                </template>
            </div>
            <div class="star-rating" tabindex="0"
                :aria-label="`${$t(l.screen_recorder_content_rated)}: ${Math.floor(normalizedRating)} ${$t(l.screen_recorder_content_stars)}`">
                <span v-for="star in Math.floor(normalizedRating)" :key="star" class="star">⭐</span>
            </div>
            <div class="catalogue-item-description" tabindex="0" :aria-label=$t(l.screen_recorder_content_name)>
                <p id="media-label">{{ props.content.name }}</p>
            </div>
        </button>
    </Panel>
</template>

<style scoped>
.catalogue-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    width: 14rem;
    height: 14rem;
    gap: 0.5rem;
    /* padding: 0.3rem; */
}

.is-from-summarycontent {
    width: 11.7rem;
}

.catalogue-item-header {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    padding: 1rem 1rem 0 1rem;
    font-size: var(--font-small);
    align-items: center;
    width: 100%;
}

.catalogue-item-media {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: auto;
    flex-shrink: 1;
    flex-direction: column;
}

.catalogue-item-description {
    display: flex;
    flex-direction: column;

    align-items: center;
    text-align: center;

    margin: 0 0.5rem 0.5rem 0.5rem;
    height: 4rem;

    overflow: hidden;
    text-overflow: ellipsis;
    line-clamp: 3;

    font-size: var(--font-small);

    p {
        margin: 0;
    }
}

.div-thumbnail {
    width: 100%;
    height: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
}

.thumbnail {
    max-width: 10rem;
    border-radius: 1rem;
    max-height: 6rem;
}

.link,
.doc {
    height: 3rem;
    width: auto;
}

.video,
.image {
    max-width: 10rem;
    border-radius: 1rem;
    max-height: 6rem;
}

.no-style {
    border: none;
    border-radius: inherit;
    margin: 0;
    padding: 0;
    background-color: transparent;
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;
}
</style>