<script setup lang="ts">
import { l } from "@/locales";
import { router } from "@/router";
import { onMounted, reactive, ref } from "vue";
import { AireContent, AireContentType } from "aire";
import { getAllSuggestedContentFromHistory } from "@/helpers/contentUtils";

import useContent from "@/context/content";

import Spinner from "@/components/common/Spinner.vue";
import Panel from "@/components/common/Panel.vue";
import ContentModal from "@/components/modals/ContentModal.vue";
import { setUIModeLayoutBeforeMount } from "@/context/ui";

const navigateTo = (path: string) => {
    router.push(path);
}

const contentModalOpen = ref(false);
const content = useContent();

const toggleContentModal = (item?: AireContent) => {
    state.selectedItem = item;
    contentModalOpen.value = !contentModalOpen.value;
};

const state = reactive<{
    busy: boolean,
    deleteId?: string,
    confirmDelete: boolean,
    selectedItem?: AireContent,
    contentList: AireContent[]
}>({
    busy: false,
    confirmDelete: false,
    contentList: []
});

const listContent = async () => {
    const ids = await getAllSuggestedContentFromHistory();
    ids.forEach(async (x) => {
        const item = await content.get(x);
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

</script>

<template>
    <ContentModal :active="contentModalOpen" :content="state.selectedItem" :onClose="toggleContentModal"
        v-if="state.selectedItem" />
    <div class="content-catalogue-view">
        <div class="content-catalogue-wraper">
            <div class="icon close-window xmark-icon" @click="navigateTo('/chat')">
            </div>
            <div class="content-catalogue-header">
                <div class="content-catalogue-logo">
                    <img src="@/assets/images/aire-logo-letter.svg" alt="Logo" />
                </div>
                <div class="content-catalogue-header-text">
                    <h3>{{ $t(l.nav_catalogue) }}</h3>
                </div>
            </div>
            <div class="content-catalogue-content">
                <Spinner v-if="state.busy" />
                <Panel class="content-catalogue-item" v-for="item in state.contentList" v-bind:key="item.id"
                    @click="toggleContentModal(item)">

                    <div class="header-panel">
                        <div v-if="item.modified">
                            {{ new Date(item.modified).toLocaleString($i18n.locale) }}
                        </div>
                        <div class="icon content-video" v-if="item.type == AireContentType.Video">
                        </div>
                        <div class="icon content-image" v-if="item.type == AireContentType.Image">
                        </div>
                        <font-awesome-icon icon="fa-solid fa-file" v-if="item.type == AireContentType.Document" />
                        <font-awesome-icon icon="fa-solid fa-link" v-if="item.type == AireContentType.URL" />
                    </div>
                    <div class="body-panel">
                        <video muted class="video" v-if="item.type == AireContentType.Video">
                            <source v-if="item.id" :src="item.url + '#t=5'" :key="item.url" type="video/mp4">
                        </video>
                        <img :src="item.url" alt="" class="image" v-if="item.type == AireContentType.Image">

                        <div class="icon catalogue-content-mobile" :src="item.url" alt=""
                            v-if="item.type == AireContentType.Document">
                        </div>
                        <div class="content-url" v-if="item.type == AireContentType.URL">
                            {{ item.url }}
                        </div>
                    </div>
                    <div class="footer-panel truncate">
                        {{ item.name }}
                    </div>
                </Panel>
            </div>
            <div class="buttons-line">
                <button class="button delete-button">{{ $t(l.button_delete_content) }}</button>
                <div class="right-cortner">
                    <div class="icon download"></div>
                    <button class="button">{{ $t(l.button_display) }}</button>
                </div>

            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.content-catalogue-view {
    display: flex;
    overflow: hidden;
    flex-direction: column;
    margin: auto;
    padding: 0rem;
    width: 100%;
    background-color: var(--panel-background-color);
    border-radius: 1rem;
    border-color: var(--panel-border-color);
    margin-top: 1rem;
    position: relative;
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
    border-bottom-style: solid;
    border-color: var(--accent-primary-color);
    width: 85%;
    padding-top: 2rem;
}

.section-separator {
    width: 85%;
    align-self: center;
}

.content-catalogue-logo {
    width: 7rem;
}

.content-catalogue-wraper {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 1rem;
    align-items: center;
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

.content-catalogue-content {
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    width: 75%;
    padding: 1rem;
    overflow: auto;
}

.content-catalogue-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 14rem;
    height: 14rem;
    padding: 1rem;

}

.header-panel {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    padding: 1rem;
    font-size: var(--font-small);
    align-items: center;
    width: 100%;
}

.body-panel {
    max-height: 12rem;
    max-width: 10.6rem;
}


.footer-panel {
    display: flex;
    flex-direction: row;
    padding: 1rem;
    align-items: center;
    text-align: center;
}

.video,
.image {
    max-width: 10rem;
    border-radius: 1rem;
    max-height: 6rem;
}

.buttons-line {
    display: flex;

    justify-content: space-between;
    width: 95%;
    padding: 1rem;
}

.right-cortner {
    display: flex;
    height: 2.5rem;
}

.button {
    width: 8rem;
    font-weight: 100;
}

.delete-button {
    background-color: var(--delete-color);
}

.download {
    height: 2.8rem;
    width: 3rem;
}

.catalogue-content-mobile {
    width: 6.5rem !important;
    height: 6.5rem !important;
}

.content-url {
    display: flex;
    overflow: hidden;
    min-height: 6rem;
}

.truncate {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    -webkit-box-orient: vertical;
}

.ui-mode-mobile {
    .content-catalogue-view {
        padding: 2rem 0rem;
        width: 95%;
    }

    .content-catalogue-section {
        &>* {
            margin: 2rem 1rem;
        }
    }
}
</style>
