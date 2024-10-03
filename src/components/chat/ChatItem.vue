<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->

<script setup lang="ts">
import { ChatMessage, ChatMessageType } from '@/models/chat';
import { computed, defineProps } from 'vue';
import ChatContentMessage from './messages/ChatContentMessage.vue';
import ChatSummaryMessage from './messages/ChatSummaryMessage.vue';
import ChatErrorMessage from './messages/ChatErrorMessage.vue';
import ChatDefaultMessage from './messages/ChatDefaultMessage.vue';
import ChatEndConversationMessage from './messages/ChatEndConversationMessage.vue';
import ChatNotificationMessage from './messages/ChatNotificationMessage.vue';
import ChatEndOptionsMessage from './messages/ChatEndOptionsMessage.vue';

const props = defineProps<{ 
    message: ChatMessage, 
    canRevert?: boolean
}>();

const isNotificationMessage = computed(() => {
    switch (props.message.type) {
        case ChatMessageType.Keyword:
            return true;
        default:
            return false;
    }
});
</script>

<template>
    <ChatNotificationMessage v-if="isNotificationMessage" :message="props.message"/>
    <ChatContentMessage v-else-if="props.message.type == ChatMessageType.Content" :message="props.message"/>
    <ChatSummaryMessage v-else-if="props.message.type == ChatMessageType.Summary" :message="props.message"/>
    <ChatEndConversationMessage v-else-if="props.message.type == ChatMessageType.EndOfConversation" :message="props.message"/>
    <ChatEndOptionsMessage v-else-if="props.message.type == ChatMessageType.EndOfConversationOptions" :message="props.message"/>
    <ChatErrorMessage v-else-if="props.message.type == ChatMessageType.Error" :message="props.message"/>
    <ChatDefaultMessage v-else :message="props.message" :canRevert="props.canRevert"/>
</template>

<style lang="scss" scoped>

</style>