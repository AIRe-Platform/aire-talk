<script setup lang="ts">
import { l } from '@/locales';
import { Login, logout } from '@/context/login';
import { Chat, createNewChat } from '@/context/chat';
import { router } from '@/router';
import MenuButton from './MenuButton.vue';
import { UIState } from '@/context/ui';

const onOpen = (e: Event) => {
    e.stopImmediatePropagation();
    UIState.showMenu = !(UIState.showMenu);
};

const onBlur = () => {
    if (UIState.showMenu) {
        UIState.showMenu = false;
        UIState.showChatHistory = false;
        UIState.showContentCatalog = false;
    }
};

const toggleChatHistoryMenu = async () => {
    UIState.showChatHistory = !(UIState.showChatHistory);
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
    <MenuButton :open="UIState.showMenu" @click="onOpen" />
    <div class="nav-menu" :class="{ 'nav-menu-open': UIState.showMenu }">
        <div class="nav-menu-bar">
            <div class="nav-link" @click="navigateTo('/')">
                <div class="nav-logo">
                    <img src="@/assets/images/aire-logo-512.png" alt="Logo">
                </div>
            </div>
            <div class="nav-menu-list">
                <div class="nav-item">
                    <div class="nav-link" @click="navigateTo('/')">
                        {{ $t(l.nav_home) }}
                    </div>
                </div>
                <div class="nav-item">
                    <div class="nav-link" @click="navigateTo('/login')" v-if="!Login.logged_in">
                        {{ $t(l.nav_login) }}
                    </div>
                    <div class="nav-link" @click="navigateTo('/profile')" v-if="Login.logged_in">
                        {{ $t(l.nav_profile) }}
                    </div>
                </div>
                <div class="nav-item" v-if="!Login.logged_in">
                    <div class="nav-link" @click="navigateTo('/signup')">
                        {{ $t(l.nav_signup) }}
                    </div>
                </div>
                <div class="nav-spacer"></div>
                <div class="nav-item">
                    <div class="nav-link" @click="navigateTo('/chat')" v-if="Login.logged_in">
                        {{ $t(l.nav_chat) }}
                    </div>
                </div>
                <div class="nav-item" @click="toggleChatHistoryMenu" v-if="Login.logged_in">
                    <a class="nav-link" href="#">
                        {{ $t(l.nav_chat_history) }}
                    </a>
                </div>
                <div class="nav-item" @click="newChat" v-if="Chat.id">
                    <a class="nav-link" href="#">
                        {{ $t(l.nav_chat_new) }}
                    </a>
                </div>
                <div class="nav-spacer"></div>
                <!--
                    <div class="nav-item" @click="toggleCatalogueContentMenu">
                        <a class="nav-link" href="#">{{ $t(l.burger_menu_content_catalogue) }}</a>
                    </div>
                    -->
                <div class="nav-spacer"></div>
                <div class="nav-item" @click="onOpen" v-if="Login.logged_in">
                    <a href="#" class="nav-link" @click="logout">
                        {{ $t(l.nav_logout) }}
                    </a>
                </div>
                <div class="nav-item">
                    <div class="nav-link" @click="navigateTo('/settings')">
                        {{ $t(l.nav_preferences) }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

.nav-menu {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;

    overflow: hidden;
    z-index: 8;

    width: 0px;
    height: 100%;
    margin: 0rem;

    transition:
        box-shadow 0.25s,
        width 0.25s,
        height 0.25s;
}

.nav-menu-open {
    width: 16rem;
    height: 100%;

    .nav-menu-list {
        opacity: 1;
    }
}

.nav-menu-bar {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding: 4rem 1rem 1rem 1rem;
    margin: 1rem;
    overflow: auto;

    background-color: var(--panel-background-color);
    border-radius: 1rem;    
    border: 1px solid var(--border-color);
    box-shadow: 0 0 5px var(--shadow-color);
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

@media screen and (max-width: 600px) {
    .menu-container {
        overflow: hidden;
        margin: 0;
        padding: 0;
        height: unset;
    }

    .nav-menu-bar {
        align-items: center;
    }

    .nav-link {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .nav-menu {
        margin: 0;
    }

    .nav-menu-open {
        width: 100%;
    }

    .nav-menu-bar {
        margin: 0.25rem;
    }

    .nav-logo {
        width: 50%;
    }
}
</style>
