<script setup lang="ts">
import { defineComponent } from 'vue';
import OnboardingTopics from '@/components/OnboardingTopics.vue';
import { l } from '@/locales';
import { router } from '@/router';
import { Login } from '@/context/login';
defineComponent({ name: "HomeView" });

const navigateTo = (path: string) => {
    router.push(path)
}
</script>

<template>
    <div id="home-view">
        <div class="greeting">
            <h1>{{ $t(l.frontpage_greeting) }}</h1>
            <p>{{ $t(l.frontpage_paragraph) }}</p>
        </div>
        <div class="quick-nav">
            <button class="get-started" @click="navigateTo('/chat')" v-if="Login.logged_in">
                {{ $t(l.nav_chat) }}
            </button>
            <button class="get-started" @click="navigateTo('/profile')" v-if="Login.logged_in">
                {{ $t(l.nav_profile) }}
            </button>
            <button class="get-started" @click="navigateTo('/login')" v-if="!Login.logged_in">
                {{ $t(l.nav_login) }}
            </button>
            <button class="get-started" @click="navigateTo('/signup')" v-if="!Login.logged_in">
                {{ $t(l.nav_signup) }}
            </button>
            <button class="get-started" @click="navigateTo('/settings')">
                {{ $t(l.nav_preferences) }}
            </button>
        </div>
    </div>
    <OnboardingTopics v-if="Login.logged_in" />
</template>

<style scoped>
#home-view {
    padding: 1rem;
    margin: auto;
}

.greeting {
    max-width: 40rem;
}

.quick-nav {
    display: flex;
    flex-direction: row;
    margin: 2rem 0;
    gap: 1rem;
}

.get-started {
    padding: 1rem;
    font-size: large;
}
</style>
