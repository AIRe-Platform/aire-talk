<script setup lang="ts">
import { l } from "@/locales";
import { router } from "@/router";
import Spinner from "@/components/Spinner.vue";
import { reactive, ref } from "vue";
import { Content, ContentType } from "aire";
import Panel from "@/components/Panel.vue";
import ContentModal from "@/components/ContentModal.vue";
import { Chat } from "@/context/chat";

const navigateTo = (path: string) => {
    router.push(path);
}

const contentModalOpen = ref(false);

const toggleContentModal = (item?: Content) => {
    state.selectedItem = item;
    contentModalOpen.value = !contentModalOpen.value;
};
const state = reactive<{
    busy: boolean,
    deleteId?: string,
    confirmDelete: boolean,
    selectedItem?: Content,
}>({
    busy: false,
    confirmDelete: false
});

</script>

<template>
    <div class="chat-history-busy" v-if="state.busy">
        <Spinner />
    </div>
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
                <Panel class="content-catalogue-item" v-for="item in  Chat.current.content" v-bind:key="item.id"
                    @click="toggleContentModal(item)">

                    <div class="header-panel">
                        <div v-if="item.modified">
                            {{ new Date(item.modified).toLocaleString($i18n.locale) }}
                        </div>
                        <div class="icon content-video" v-if="item.type == ContentType.Video">
                        </div>
                        <div class="icon content-image" v-if="item.type == ContentType.Image">
                        </div>
                        <font-awesome-icon icon="fa-solid fa-file" v-if="item.type == ContentType.Document" />
                        <font-awesome-icon icon="fa-solid fa-link" v-if="item.type == ContentType.URL" />

                    </div>
                    <div class="body-panel">
                        <video controls muted class="video" v-if="item.type == ContentType.Video">
                            <source v-if="item.id" :src="item.url" :key="item.url" type="video/mp4">
                        </video>
                        <img :src="item.url" alt="" class="image" v-if="item.type == ContentType.Image">

                        <div class="icon catalogue-content-mobile" :src="item.url" alt=""
                            v-if="item.type == ContentType.Document">
                        </div>
                        <div class="content-url" v-if="item.type == ContentType.URL">
                            {{ item.url }}
                        </div>
                    </div>
                    <div class="footer-panel">
                        {{ item.name }}
                    </div>
                </Panel>
            </div>
            <div class="buttons-line">
                <button class="button delete-button"> delete content</button>
                <div class="right-cortner">
                    <div class="icon download"></div>
                    <button class="button"> display</button>
                </div>

            </div>
        </div>
    </div>
</template>

<style scoped>
.content-catalogue-view {
    display: flex;
    overflow: hidden;
    flex-direction: column;
    margin: auto;
    padding: 0rem;
    width: 100%;
    max-width: 99%;
    min-height: 98%;
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
    height: 80%;
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
    height: 39.5rem;
    overflow: auto;
}

.content-catalogue-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 14rem;
    padding: 1rem;
    max-height: 12rem;

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

    max-width: 10.6rem;
}


.footer-panel {
    display: flex;
    flex-direction: row;
    padding: 1rem;
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

@media screen and ((max-aspect-ratio: 1/1) or (max-width: 920px)) {
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
