<script setup lang="ts">
import OnboardingTopics from '@/components/OnboardingTopics.vue';
import { l } from '@/locales';
import { router } from '@/router';
import { reactive } from 'vue';
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import { Login, logout } from "@/context/login";
import { getAllChats, openChat, createNewChat } from "@/context/chat";

const state = reactive<{
    showConfirmLogout: boolean,
    showYouAreOutMessage: boolean,
}>({
    showConfirmLogout: false,
    showYouAreOutMessage: false,
});

const onConfirmLogout = async () => {

    state.showConfirmLogout = false;

    setTimeout(() => {
        state.showYouAreOutMessage = true;
    }, 300);
}
const newChat = async () => {
    await createNewChat();
    navigateTo("/chat");
};


const showLogout = async () => {
    state.showYouAreOutMessage = false;
    await logout();
    router.push("/");
}

const openLastChat = async () => {
    const chats = await getAllChats();
    const open = await openChat(chats[0].id);
    if (open)
        router.push("/chat");
}
const navigateTo = (path: string) => {
    router.push(path)
}

</script>

<template>
    <div id="home-view">
        <div class="home-container">
            <div class="home-header">
                <div class="aire-logo">
                    <img src="@/assets/images/aire-logo-letter.svg" alt="Logo" />
                </div>
                <p>{{ $t(l.start_first_paragraph) }}</p>
            </div>

            <div class="quick-nav">
                <button class="get-started" @click="newChat()" v-if="Login.user">
                    {{ $t(l.home_start_new_chat) }}
                </button>
                <button class="get-started" @click="openLastChat()" v-if="Login.user">
                    {{ $t(l.home_continue_chat) }}
                </button>
                <button class="get-started" @click="" v-if="Login.user">
                    <div class="" @click="state.showConfirmLogout = !state.showConfirmLogout" v-if="Login.user">
                        {{ $t(l.nav_logout) }}
                    </div>
                </button>
            </div>
            <div class="home-footer">
                <p>{{ $t(l.start_footer) }}</p>
                <div class="chat-bot">
                </div>
            </div>
        </div>
    </div>
    <OnboardingTopics v-if="Login.user" />
    <ConfirmDialog v-if="state.showConfirmLogout" @accept="onConfirmLogout" @decline="state.showConfirmLogout = false">
        {{ $t(l.popup_confirm_logout) }}
    </ConfirmDialog>
    <ConfirmDialog v-if="state.showYouAreOutMessage" @accept="showLogout" :hideDecline="true">
        {{ $t(l.popup_logout_message) }}
    </ConfirmDialog>
</template>

<style scoped>
#home-view {
    width: 100%;
    height: 100%;
    background-image: var(--back-ground-texture);
    color: var(--title-text)
}

.home-container {
    margin: auto;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
}

.home-header {
    width: 100%;
    height: 40%;
    background-image: url("@/assets/images/aire_fp_papertexture_cropped.png");
    background-repeat: no-repeat;
    background-size: contain;
    display: flex;
    align-items: center;
    flex-direction: column;
    padding-top: 5rem;
    font-weight: bold;
}

.aire-logo {
    width: 20rem;
}

.quick-nav {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    margin: 2rem 0;
    gap: 2rem;
}

.get-started {
    width: 216.32px;
    height: 55px;
    border-radius: 20px;
    background: var(--button-gradient-color);
    font-size: var(--font-medium);
    color: var(--button-text);
}

.home-footer {
    margin-top: 10rem;
    background-color: white;
    width: 100%;
    height: 4rem;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    position: relative;
}

.chat-bot {
    position: absolute;
    padding: 4rem;
    width: 5rem;
    height: 5rem;
    scale: 0.6;
    right: 0;
    background-image: url(/src/assets/images/aire-bot.png);
    background-repeat: no-repeat;
}
</style>
