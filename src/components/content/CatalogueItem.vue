<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->

<script setup lang="ts">
import Panel from '@/components/common/Panel.vue';
import { defineProps, defineEmits } from "vue";
import { AireContentType, AireContent } from 'aire';

const props = defineProps<{
    content: AireContent,
    isFromSummary: boolean
}>();

const emits = defineEmits<{
    show: [AireContent]
}>();
</script>

<template>
    <Panel class="catalogue-item" @click="emits('show', props.content);"
        :class="{ 'is-from-summarycontent': props.isFromSummary }">

        <div class="catalogue-item-header">
            <div v-if="props.content.modified">
                {{ new Date(props.content.modified).toLocaleString($i18n.locale) }}
            </div>
            <div class="icon content-video" v-if="props.content.type == AireContentType.Video">
            </div>
            <div class="icon content-image" v-if="props.content.type == AireContentType.Image">
            </div>
            <div class="icon content-document" v-if="props.content.type == AireContentType.Document">
            </div>
            <div class="icon content-url" v-if="props.content.type == AireContentType.URL">
            </div>
        </div>
        <div class="catalogue-item-media">
            <video muted class="video" v-if="props.content.type == AireContentType.Video">
                <source v-if="props.content.id" :src="props.content.url + '#t=5'" :key="props.content.url"
                    type="video/mp4">
            </video>
            <img :src="props.content.url" alt="" class="image" v-if="props.content.type == AireContentType.Image">
            <div v-if="props.content.type == AireContentType.URL">
                <div class="icon content-url" v-if="!props.content.thumbnailUrl"></div>
                <div v-else class="div-thumbnail">
                    <img class="thumbnail" :src="props.content.thumbnailUrl" alt="Thumbnail" />
                </div>
            </div>
            <div v-if="props.content.type == AireContentType.Document">
                <font-awesome-icon class="doc" icon="fa-solid fa-file-invoice" v-if="!props.content.thumbnailUrl" />
                <div v-else class="div-thumbnail">
                    <img class="thumbnail" :src="props.content.thumbnailUrl" alt="Thumbnail" />
                </div>
            </div>

        </div>
        <div class="catalogue-item-description">
            <p>{{ props.content.name }}</p>
        </div>
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
}

.catalogue-item-description {
    display: flex;
    flex-direction: column;

    align-items: center;
    justify-content: center;
    text-align: center;

    margin: 0 0.5rem 0.5rem 0.5rem;
    height: 4rem;

    overflow: hidden;
    text-overflow: ellipsis;
    line-clamp: 3;

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
</style>