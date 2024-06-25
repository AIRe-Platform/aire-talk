<script setup lang="ts">
import { l } from "@/locales";
import { router } from "@/router";
import { onMounted, reactive, ref } from "vue";
import { AireContent, AireContentType } from "aire";
import { getAllSuggestedContentFromHistory } from "@/helpers/contentUtils";

import useContent from "@/context/content";

import Spinner from "@/components/common/Spinner.vue";
import CatalogueItem from "@/components/content/CatalogueItem.vue";
import ContentModal from "@/components/content/ContentModal.vue";
import { setUIModeLayoutBeforeMount } from "@/context/ui";

const navigateTo = (path: string) => {
    router.push(path);
}

const contentContext = useContent();

const state = reactive<{
    busy: boolean,
    deleteId?: string,
    openContent?: AireContent,
    confirmDelete: boolean,
    selectedItem?: AireContent,
    contentList: AireContent[],
    modalOpen: boolean
}>({
    busy: false,
    confirmDelete: false,
    modalOpen: false,
    contentList: []
});

const toggleModal = () => {
    state.modalOpen = !state.modalOpen;
};

const closeModal = () => {
    state.openContent = undefined;
    toggleModal();
};
const listContent = async () => {
    const ids = await getAllSuggestedContentFromHistory();
    ids.forEach(async (x) => {
        const item = await contentContext.get(x);
        if (item) {
            state.contentList.push(item);
        }
    })
}

onMounted(() => {
    setUIModeLayoutBeforeMount();
    state.busy = true;
    listContent()
        .finally(() => {
            state.busy = false;
        })
})

const showContent = async (content: AireContent) => {
    state.openContent = content;
    switch (content.type) {
        case AireContentType.Image:
        case AireContentType.Video:
            toggleModal();
            break;
        default:
            {
                const url = content.id ? await contentContext.getUrl(content.id) : content.url;
                if (url) {
                    window.open(url, '_blank');
                }
            }
    }

    if (content.id)
        contentContext.addViewCount(content.id);
};
</script>

<template>
    <ContentModal :active="state.openContent !== undefined && state.modalOpen" :content="state.openContent"
        :onClose="closeModal" />
    <div class="content-catalogue-view">
        <div class="icon close-window xmark-icon" @click="navigateTo('/chat')">
        </div>
        <div class="content-catalogue-header">
            <div class="content-catalogue-header-text">
                <h3>{{ $t(l.nav_catalogue) }}</h3>
            </div>
        </div>
        <div class="content-catalogue-list">
            <Spinner v-if="state.busy" />
            <CatalogueItem v-for="item in state.contentList" v-bind:key="item.id" :content="item" @show="showContent" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.content-catalogue-view {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-grow: 1;

    padding: 0rem;


    background-color: var(--panel-background-color);
    border-radius: 1rem;
    border-color: var(--panel-border-color);
    position: relative;

    overflow: hidden;
}

.xmark-icon {
    position: absolute;
    right: 1rem;
    top: 1rem;
}

.content-catalogue-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 2rem;
    border-bottom: 2px solid var(--accent-primary-color);
    width: 85%;
    padding-top: 2rem;
}

.section-separator {
    width: 85%;
    align-self: center;
}

.content-catalogue-section {
    display: flex;
    flex-direction: column;
    align-self: stretch;
    background-color: var(--panel-background-color);
    overflow: hidden;

    &>* {
        margin: 2rem 3rem;
    }
}

.content-catalogue-list {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: center;
    padding: 1rem;
    overflow: auto;
}

.ui-mode-mobile {
    .content-catalogue-view {
        padding: 2rem 0rem;
        width: 95%;
    }
}
</style>
