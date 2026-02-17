<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->

<script setup lang="ts">
import { ChatMessage, ChatMessageType } from '@/models/chat';
import { computed } from 'vue';
import ChatContentSuggestions from './messages/ChatContentSuggestions.vue';
import ChatSummary from './messages/ChatSummary.vue';
import ChatError from './messages/ChatError.vue';
import ChatBubble from './messages/ChatBubble.vue';
import ChatNotification from './messages/ChatNotification.vue';
import ChatEndConversation from './messages/ChatEndConversation.vue';
import ChatEndConversationOptions from './messages/ChatEndConversationOptions.vue';
import ChatReminderCreated from './messages/ChatReminderCreated.vue';

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
    <ChatNotification v-if="isNotificationMessage" :message="props.message" />
    <ChatContentSuggestions v-else-if="props.message.type == ChatMessageType.Content" :message="props.message" />
    <ChatSummary v-else-if="props.message.type == ChatMessageType.Summary" :message="props.message" />
    <ChatEndConversation v-else-if="props.message.type == ChatMessageType.EndOfConversation" :message="props.message" />
    <ChatEndConversationOptions v-else-if="props.message.type == ChatMessageType.EndOfConversationOptions"
        :message="props.message" />
    <ChatReminderCreated v-else-if="props.message.type == ChatMessageType.ReminderCreated" :message="props.message" />
    <ChatError v-else-if="props.message.type == ChatMessageType.Error" :message="props.message" />
    <ChatBubble v-else-if="props.message.type == ChatMessageType.Default" :message="props.message"
        :canRevert="props.canRevert" />
</template>

<style lang="scss" scoped></style>