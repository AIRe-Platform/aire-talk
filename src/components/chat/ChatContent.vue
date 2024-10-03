<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->

<script setup lang="ts">
import useContent from '@/context/content';
import { ChatMessage } from '@/models/chat';
import { AireContent } from 'aire';
import { defineProps, defineEmits, reactive, onMounted } from 'vue';
import CatalogueItem from "@/components/content/CatalogueItem.vue";
import ChatItemOptions from '@/components/chat/ChatItemOptions.vue';

const props = defineProps<{
    parent?: ChatMessage,
    contentId: string;
}>();

const emits = defineEmits<{
    show: [AireContent]
}>();

const state = reactive<{
    content?: AireContent
}>({});

onMounted(async () => {
    state.content = await useContent().get(props.contentId);
})
</script>

<template>
    <div class="chat-content" v-if="state.content" @click.stop="emits('show', state.content!)">
        <div class="chat-content-options">
            <ChatItemOptions v-if="props.parent" :parent="props.parent" :can_revert="false" :content="state.content" />
        </div>
        <CatalogueItem :content="state.content" @show="state.content!" :is-from-summary="true" />
    </div>
</template>

<style scoped lang="scss">
.chat-content {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    border-radius: 1rem;
    padding-top: 1rem;
}

.chat-content-options {
    position: relative;
    top: 1rem;
    right: 1rem;
    width: inherit;
}

@media screen and ((max-aspect-ratio: 1/1) or (max-width: 920px)) {
    .chat-content {
        max-width: unset;
        min-width: unset;
    }
}
</style>