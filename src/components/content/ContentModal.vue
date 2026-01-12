<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->

<script setup lang="ts">
import { ChatMessage } from '@/models/chat';
import { nextTick, onMounted, reactive, ref, watch } from 'vue';
import { AireContent, AireContentType } from 'aire';
import Modal from "@/components/common/Modal.vue";
import { switchFocus } from '@/helpers/keyboardNavigation';
import { listChatKeywords, openAndContinueChat } from '@/helpers/chatUtils';
import { router } from '@/router';
import { getUILanguage, l } from '@/locales';
import useStatistics from '@/context/statistics';
import useChat from '@/context/chat';
import useLogin from '@/context/login';
import { ContentEvent, ContentEventAction, ContentEventName } from '@/models/statistics';
import useKeywords from '@/context/keywords';

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
const statistics = useStatistics();
const chat = useChat();
const login = useLogin();

const openUrl = (url?: string) => {
    if (url) {
        if (!props.chatId) {
            statistics.sendEvent(new ContentEvent(
                props.content?.id,
                props.content?.name,
                listChatKeywords().join(','),
                chat.id,
                login.user?.uuid,
                statistics.session?.id,
                ContentEventName.Opened,
                ContentEventAction.LinkOpen,
            ));
        }
        window.open(url, '_blank');
    }
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
        const translatedKeywords = await useKeywords().updateMetadata(keywords);

        // Resolve translations
        const lang = getUILanguage();
        state.translatedKeywords = translatedKeywords
            .map(x => useKeywords().getTranslation(x.value, lang.value))
            .filter(x => x !== undefined);

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
        <Modal :active="active" @close="props.onClose" :showCloseButton="true" role="dialog"
            aria-labelledby="modal-title" aria-describedby="modal-description">
            <div v-if="!props.parent" class="message-header-gap"></div>
            <div class="message-container" v-if="props.content">
                <div class="header">
                    <h2 id="modal-title" tabindex="0">{{ props.content.name || $t(l.content_modal_untitled) }}</h2>
                </div>
                <div class="message-body">
                    <p v-if="props.parent && props.parent.content" id="modal-parent-content">{{ props.parent.content }}
                    </p>
                    <div class="message-media" v-if="props.content">
                        <div class="message-media-file">
                            <template v-if="props.content.type == AireContentType.Image">
                                <img v-bind:src="props.content.url"
                                    :alt="props.content.name || $t(l.screen_recorder_image_content_unnamed)" tabindex="0"
                                    :aria-label="`${$t(l.screen_recorder_image_content)} ${props.content.name || $t(l.screen_recorder_image_content_unnamed)}`" />
                            </template>
                            <template v-if="props.content.type == AireContentType.Video">
                                <video controls autoplay aria-labelledby="modal-title"
                                    :aria-label="`${$t(l.screen_recorder_video_content)} ${props.content.name || $t(l.screen_recorder_video_content_unnamed)}`">
                                    <source v-bind:src="props.content.url" type="video/mp4" />
                                    <p>{{ $t(l.content_modal_browser_does_not_support_video_tag) }} <a
                                            :href="props.content.url">{{ $t(l.content_modal_download) }}</a>.</p>
                                </video>
                            </template>
                            <a href="#" v-if="props.content.type == AireContentType.URL"
                                @click="openUrl(props.content.url)" @keydown.space="openUrl(props.content.url)"
                                :aria-label="`${$t(l.screen_recorder_open_url)} ${props.content.name || $t(l.screen_recorder_untitled_url)}, ${$t(l.screen_recorder_new_tab)}`"
                                aria-describedby="modal-description">
                                <div class="icon content-url content-modal-width-icon"
                                    v-if="!props.content.thumbnail_url" :aria-hidden="true">
                                </div>
                                <div v-else class="div-thumbnail">
                                    <img class="thumbnail" :src="props.content.thumbnail_url"
                                        :alt="props.content.thumbnail_file_name || $t(l.content_modal_untitled_url_thumbnail)" />
                                </div>
                            </a>
                            <a href="#" v-if="props.content.type == AireContentType.Document"
                                @click="openUrl(props.content.url)" @keydown.space="openUrl(props.content.url)"
                                :aria-label="`${$t(l.screen_recorder_open_document)} ${props.content.name || $t(l.screen_recorder_untitled_document)}, ${$t(l.screen_recorder_new_tab)}`"
                                aria-describedby="modal-description">
                                <div class="icon content-document content-modal-width-icon"
                                    v-if="!props.content.thumbnail_url" :aria-hidden="true">
                                </div>
                                <div v-else class="div-thumbnail">
                                    <img class="thumbnail" :src="props.content.thumbnail_url"
                                        :alt="props.content.thumbnail_file_name || $t(l.content_modal_untitled_document_thumbnail)" />
                                </div>
                            </a>
                        </div>
                        <div class="copyright" v-if="props.content.copyright">
                            <p tabindex="0">{{ props.content.copyright }}</p>
                        </div>
                    </div>
                    <div class="modal-content">
                        <h2 class="modal-title" id="modal-description" tabindex="0">{{ $t(l.content_modal_description)
                        }}</h2>
                        <p tabindex="0">{{ props.content.description || $t(l.content_modal_no_description) }}</p>
                    </div>
                    <div class="modal-content">
                        <h2 class="modal-title" id="modal-themes" tabindex="0">{{ $t(l.content_modal_themes) }}</h2>
                        <p v-if="state.translatedKeywords" tabindex="0">{{ state.translatedKeywords.join(', ') }}</p>
                    </div>
                </div>
                <div class="message-options">
                    <button class="btn button" v-if="props.chatId" @click="returnToConversation(props.chatId)"
                        :aria-label=$t(l.content_modal_continue_to_chat)>
                        <span class="button-text">{{ $t(l.content_modal_continue_to_chat) }}</span>
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
        max-width: 50rem;
        max-height: 25rem;
        border-radius: 1rem;
    }

    img,
    video {
        width: 100%;
        height: auto;
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

        .content-document {
            background-position: center;
        }
    }
}
</style>