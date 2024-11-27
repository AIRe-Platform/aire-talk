<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->

<script setup lang="ts">
import { ChatMessage } from '@/models/chat';
import { defineProps, nextTick, onMounted, reactive, ref, watch } from 'vue';
import { AireContent, AireContentType } from 'aire';
import Modal from "@/components/common/Modal.vue";
import { switchFocus } from '@/helpers/keyboarNavigation';
import { openAndContinueChat } from '@/helpers/chatUtils';
import { router } from '@/router';
import { l } from '@/locales';
import { getTranslation, updateKeywordMetadata } from '@/helpers/keywordUtils';

const props = defineProps<{
    active: boolean,
    parent?: ChatMessage,
    content?: AireContent,
    chatId?: string,
    onClose: () => void
}>()
const state = reactive<{
    translatedKeywords?: string[]

}>({
    translatedKeywords: []
});
const contentModalRef = ref<HTMLElement | null>(null);

const openUrl = (url?: string) => {
    if (url)
        window.open(url, '_blank');
};

watch(() => props.active, (active) => {
    if (active) {
        nextTick(() => switchFocus(true, contentModalRef.value));
    }
});

watch(
    () => props.content?.keywords,
    (newKeywords) => {
        updateKeywords(newKeywords);
    }
);

const returnToConversation = (id: string) => {
    openAndContinueChat(id)
        .then(result => {
            if (result)
                router.push({
                    name: "Chat",
                    params: { id: id }
                });
        });
}
const updateKeywords = async (keywords: string[] | undefined) => {
    if (!keywords || keywords.length === 0) return;

    try {
        const translatedKeywords = await updateKeywordMetadata(keywords);
        // Resolve translations
        state.translatedKeywords = await Promise.all(
            translatedKeywords.map(async (keyword) => await getTranslation(keyword))
        );
    } catch (error) {
        console.error("Error updating keywords:", error);
    }
};

onMounted(async () => {
    if (props.content?.keywords) {
        updateKeywords(props.content.keywords);
    }
});

</script>

<template>
    <div ref="contentModalRef" @keydown.prevent.tab.exact="switchFocus(true, contentModalRef)"
        @keydown.prevent.shift.tab="switchFocus(false, contentModalRef)">
        <Modal :active="active" @close="props.onClose" :showCloseButton="true">
            <div v-if="!props.parent" class="message-header-gap"></div>
            <div class="message-container" v-if="props.content">
                <div class="header">
                    <h2>{{ props.content.name }}</h2>
                </div>
                <div class="message-body">
                    <p v-if="props.parent && props.parent.content">{{ props.parent.content }}</p>
                    <div class="message-media" v-if="props.content">
                        <div class="message-media-file">
                            <template v-if="props.content.type == AireContentType.Image">
                                <img v-bind:src="props.content.url" />
                            </template>
                            <template v-if="props.content.type == AireContentType.Video">
                                <video controls autoplay>
                                    <source v-bind:src="props.content.url" type="video/mp4">
                                </video>
                            </template>
                            <div class="alpha" v-if="props.content.type == AireContentType.URL"
                                v-on:click="openUrl(props.content.url)">
                                <div class="icon content-url content-modal-width-icon"
                                    v-if="!props.content.thumbnail_url"></div>
                                <div v-else class="div-thumbnail">
                                    <img class="thumbnail" :src="props.content.thumbnail_url" alt="Thumbnail" />
                                </div>
                            </div>
                            <div class="alpha" v-if="props.content.type == AireContentType.Document"
                                v-on:click="openUrl(props.content.url)">
                                <div class="icon content-document-icon content-modal-width-icon"
                                    v-if="!props.content.thumbnail_url">
                                </div>
                                <div v-else class="div-thumbnail">
                                    <img class="thumbnail" :src="props.content.thumbnail_url" alt="Thumbnail" />
                                </div>
                            </div>
                        </div>
                        <div class="copyright" v-if="props.content.copyright">
                            <p>{{ props.content.copyright }}</p>
                        </div>
                    </div>
                    <div class="modal-content">
                        <p class="modal-title">{{ $t(l.content_modal_description) }} </p>
                        <p>{{ props.content.description }}</p>
                    </div>

                    <div class="modal-content">
                        <p class="modal-title">{{ $t(l.content_modal_themes) }}</p>
                        <p v-if="state.translatedKeywords">{{ state.translatedKeywords.join(', ') }}</p>
                    </div>
                </div>
                <div class="message-options">
                    <button class="btn button" v-if="props.chatId" @click="returnToConversation(props.chatId)">
                        <span class="button-text"> {{ $t(l.content_modal_continue_to_chat) }} </span>
                        <font-awesome-icon icon="fa-solid fa-comment" />
                    </button>
                </div>
            </div>
        </Modal>
    </div>
</template>

<style lang="scss" scoped>
.header {
    display: flex;
    margin-bottom: 1rem;
    align-items: center;
    justify-content: center;
    font-size: var(--font-large);
    font-weight: bold;
}

.message-container {
    display: flex;
    flex-direction: column;

}

.message-options {
    cursor: pointer;
    display: flex;
    justify-content: flex-end;
}

.modal-title {
    display: inline;
}

.modal-content {
    padding: 1rem;
    display: flex;
    flex-direction: column;
}

.message-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    align-items: flex-start;
}

.message-media-file {
    display: flex;
    align-items: center;
    justify-content: center;
}

.alpha {
    display: flex;
}

.message-header {
    margin-right: 2rem;
}

.message-header-gap {
    padding-top: 1rem;
}

.copyright {
    display: flex;
    font-size: var(--font-small);
    padding: 0rem 1rem;
}

.message-media {

    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;

    img,
    video,
    .content-document {
        width: 100%;
        height: auto;
        max-width: 50rem;
        max-height: 25rem;
        border-radius: 1rem;
    }

    .media-url {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        max-width: 32rem;
        gap: 1rem;

        svg {
            width: 32px;
            height: auto;
        }

        span {
            text-overflow: ellipsis;
            overflow: hidden
        }
    }

    .media-document {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        max-width: 32rem;
        gap: 1rem;

        svg {
            width: 64px;
            height: auto;
        }

        span {
            width: 100%;
            text-overflow: ellipsis;
            overflow: hidden
        }
    }
}

.button {
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
    align-items: center;
}

.button-text {
    font-size: var(--font-small);
}

@media screen and ((max-aspect-ratio: 1/1) or (max-width: 920px)) {
    .message-media {
        img,
        video,
        .content-document {
            max-width: 20rem;
            max-height: 10rem;
            border-radius: 1rem;
        }
    }
}
</style>