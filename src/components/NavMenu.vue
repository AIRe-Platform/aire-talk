<script setup lang="ts">
import { ref } from 'vue';
import { vOnClickOutside } from '@vueuse/components'
import { l } from '@/locales';
import { Login, logout } from '@/context/login';
import { Chat, createNewChat } from '@/context/chat';
import { router } from '@/router';
import ChatHistory from '@/components/ChatHistory.vue';
import MenuButton from './MenuButton.vue';

const isChatHistoryOpen = ref(false);
const isCatologueContentOpen = ref(false);
const menuOpen = ref(false);

const toggleMenu = () => {
    menuOpen.value = !(menuOpen.value);
    if (menuOpen.value === false) {
        isChatHistoryOpen.value = false;
        isCatologueContentOpen.value = false;
    }
};

const onBlur = () => {
    menuOpen.value = false;
    isChatHistoryOpen.value = false;
    isCatologueContentOpen.value = false;
};

const toggleChatHistoryMenu = async () => {
    isChatHistoryOpen.value = !(isChatHistoryOpen.value);
    isCatologueContentOpen.value = false;

    if (!isChatHistoryOpen.value)
        onBlur()
};

const newChat = async () => {
    await createNewChat()
    onBlur();
    router.push("/chat")
};

const navigateTo = (path: string) => {
    onBlur()
    router.push(path)
}
</script>

<template>
    <div v-on-click-outside="onBlur">
        <div class="nav-menu" :class="{ 'nav-menu-open': menuOpen }">
            <MenuButton :open="menuOpen" @click.stop="toggleMenu" />
            <div class="nav-menu-bar" v-show="menuOpen">
                <div class="nav-link" @click="navigateTo('/')">
                    <div class="nav-logo">
                        <img src="@/assets/logos/AIRE-Platform-Logo-400x400.png" alt="Logo">
                    </div>
                </div>
                <div class="nav-menu-list">
                    <div class="nav-item">
                        <div class="nav-link" @click="navigateTo('/')">
                            {{ $t(l.nav_home) }}
                        </div>
                    </div>
                    <div class="nav-item">
                        <div v-if="Login.logged_in === false" class="nav-link" @click="navigateTo('/login')">{{
                            $t(l.nav_login) }}
                        </div>
                        <div v-if="Login.logged_in === true" class="nav-link" @click="navigateTo('/profile')">{{
                            $t(l.nav_profile) }}
                        </div>
                    </div>
                    <div class="nav-item" v-if="Login.logged_in === false">
                        <div class="nav-link" @click="navigateTo('/signup')">
                            {{ $t(l.nav_signup) }}
                        </div>
                    </div>
                    <div class="nav-spacer"></div>
                    <div class="nav-item">
                        <div class="nav-link" @click="navigateTo('/chat')">
                            {{ $t(l.nav_chat) }}
                        </div>
                    </div>
                    <div class="nav-item" @click="toggleChatHistoryMenu" v-if="Login.logged_in">
                        <a class="nav-link" href="#">{{ $t(l.nav_chat_history) }}</a>
                    </div>
                    <div class="nav-item" @click="newChat" v-if="Chat.id">
                        <a class="nav-link" href="#"> {{ $t(l.nav_chat_new) }} </a>
                    </div>
                    <div class="nav-spacer"></div>
                    <!--
                    <div class="nav-item" @click="toggleCatalogueContentMenu">
                        <a class="nav-link" href="#">{{ $t(l.burger_menu_content_catalogue) }}</a>
                    </div>
                    -->
                    <div class="nav-spacer"></div>
                    <div class="nav-item" @click="toggleMenu" v-if="Login.logged_in === true">
                        <a href="#" class="nav-link" @click="logout">{{ $t(l.nav_logout) }}</a>
                    </div>
                    <div class="nav-item">
                        <div class="nav-link" @click="navigateTo('/settings')">
                            {{ $t(l.nav_preferences) }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <ChatHistory v-if="isChatHistoryOpen" :onClosePanel="toggleChatHistoryMenu" />
    </div>
    <div class="menu-blur" v-if="menuOpen">
    </div>
</template>

<style scoped lang="scss">
.menu-blur {
    z-index: 1;
    background: rgba(255, 255, 255, .7);
    opacity: 0.4;
    height: 100%;
    width: 100vw;
    position: fixed;
}

.nav-menu {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    overflow: hidden;

    position: absolute;
    width: 2.5rem;
    height: 2rem;
    z-index: 2;

    background-color: var(--panel-background-color);
    border-radius: 1rem;
    border: 1px solid var(--border-color);
    box-shadow: 0 0 5px var(--shadow-color);

    padding: 1rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
    margin-left: 1rem;

    transition:
        width 0.25s,
        height 0.25s;
}

.nav-menu-open {
    width: 12rem;
    height: 80%;

    .nav-menu-list {
        opacity: 1;
    }
}

.nav-menu-bar {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    height: 100%;
}

.nav-logo {
    width: 100%;
    margin-top: 2rem;

    display: flex;
    justify-content: center;
    align-items: center;

    img {
        display: block;
        object-fit: contain;
        width: 80%;
    }
}

.nav-menu-list {
    margin-top: 2rem;
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    height: 100%;
    opacity: 0;
    transition: opacity 0.25s 0.25s;
}

.nav-item {
    padding: 1rem;
    display: flex;
    justify-content: center;
    cursor: pointer;
}

.nav-spacer {
    flex-grow: 1;
}

@media screen and (max-width: 600px) {}
</style>
