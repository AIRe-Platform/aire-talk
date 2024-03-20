<script setup lang="ts">
import OnboardingTopics from '@/components/OnboardingTopics.vue';
import { l } from '@/locales';
import { router } from '@/router';
import { Login } from '@/context/login';

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
            <button class="get-started" @click="navigateTo('/chat')" v-if="Login.user">
                {{ $t(l.nav_chat) }}
            </button>
            <button class="get-started" @click="navigateTo('/profile')" v-if="Login.user">
                {{ $t(l.nav_profile) }}
            </button>
            <button class="get-started" @click="navigateTo('/login')" v-if="!Login.user">
                {{ $t(l.nav_login) }}
            </button>
            <button class="get-started" @click="navigateTo('/signup')" v-if="!Login.user">
                {{ $t(l.nav_signup) }}
            </button>
        </div>
    </div>
    <OnboardingTopics v-if="Login.user" />
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
    flex-wrap: wrap;
    margin: 2rem 0;
    gap: 1rem;
}

.get-started {
    padding: 1rem;
    font-size: large;
}
</style>
