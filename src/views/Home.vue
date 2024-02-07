<script setup lang="ts">
import { defineComponent } from 'vue';
import OnboardingTopics from '@/components/OnboardingTopics.vue';
defineComponent({ name: "HomeView" });
</script>

<template>
    <div id="home-view">
        <RouterLink to="/chat" id="chat-link">
            <div id="chat-link-btn" class="panel">
                {{ $t("chat_link_button_label") }}
            </div>
        </RouterLink>
    </div>
    <OnboardingTopics />
</template>

<style scoped>
#home-view {
    padding: 1rem;
    margin: auto;
}

#chat-link-btn {
    padding: 2rem;
}
</style>
