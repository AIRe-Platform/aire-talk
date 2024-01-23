<script setup lang="ts">
    import { defineComponent } from 'vue';
    import OnboardingFromExternalSiteVue from '@/components/OnboardingFromExternalSite.vue';
    defineComponent({ name: "HomeView" });
</script>

<template>
    <div id="home-view">
        <router-link to="/chat" id="chat-link">
            <div id="chat-link-btn" class="panel">
                {{ $t("chat_link_button_label") }}
            </div>
        </router-link>
    </div>
    <OnboardingFromExternalSiteVue></OnboardingFromExternalSiteVue>
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
@/context/burgerMenu