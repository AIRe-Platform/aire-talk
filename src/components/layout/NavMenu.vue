<script setup lang="ts">
import i18n, { l } from "@/locales";
import { router } from "@/router";
import { UIPanels, UIState } from "@/context/ui";
import useMobileLayout from "@/helpers/mobile";
import useLogin from "@/context/login";
import useChat from "@/context/chat";

import Separator from "@/components/common/Separator.vue";
import Panel from "@/components/common/Panel.vue";
import NavItem from "@/components/layout/NavItem.vue";
import NavButton from "@/components/layout/NavButton.vue";

const login = useLogin();
const chat = useChat();

const onOpen = (e: Event) => {
    e.stopImmediatePropagation();
    UIState.showMenu = !UIState.showMenu;
    if (!UIState.showMenu)
        UIState.isNavMenuCompressed = false;
};

const toggleChatHistoryMenu = () => {
    switchMenu();
    UIState.panels.add(UIPanels.ChatHistory);
};

const switchMenu = () => {
    if (useMobileLayout.value) {
        if (!UIState.isNavMenuCompressed) {
            UIState.isNavMenuCompressed = !UIState.isNavMenuCompressed;
        }
    }
};

const newChat = async () => {
    await chat.startNew();
    navigateTo("/chat");
};

const navigateTo = (path: string) => {
    router.push(path);

    UIState.showMenu = false;
    UIState.isNavMenuCompressed = false;
};

const toggleSettingsPanel = () => {
    switchMenu();
    UIState.panels.add(UIPanels.Settings);
};
</script>

<template>
    <NavButton :open="UIState.showMenu" @click="onOpen"></NavButton>
    <div class="nav-menu" :class="{ 'nav-menu-open': UIState.showMenu, 'short-nav-menu': UIState.isNavMenuCompressed }">
        <Panel class="nav-menu-bar">
            <div class="nav-link" v-if="login.user" @click="navigateTo('/home')">
                <div class="nav-logo" v-if="!useMobileLayout">
                    <img src="@/assets/images/aire-logo-letter.svg" alt="Logo" />
                </div>
            </div>
            <div class="nav-link" v-if="!login.user" @click="navigateTo('/')">
                <div class="nav-logo">
                    <img src="@/assets/images/aire-logo-letter.svg" alt="Logo" />
                </div>
            </div>
            <div class="nav-menu-list">
                <Separator v-if="!UIState.isNavMenuCompressed" />
                <NavItem v-if="login.user" :label="i18n.global.t(l.nav_chat_history)" icon="chat-history-mobile"
                    @click="toggleChatHistoryMenu"
                    :active="!useMobileLayout && UIState.panels.has(UIPanels.ChatHistory)" />
                <NavItem v-if="login.user" :label="i18n.global.t(l.nav_chat)" icon="new-chat-mobile"
                    @click="navigateTo('/chat')" :active="!useMobileLayout && $route.matched.some(
                        (p) => p.name === 'Chat'
                    )" />
                <NavItem v-if="chat.id" :label="i18n.global.t(l.nav_chat_new)" icon="new-chat-mobile" @click="newChat" :active="false" />
                <NavItem v-if="login.user" :label="i18n.global.t(l.nav_catalogue)"
                    icon="catalogue-content-mobile margin-left" @click="navigateTo('/content-catalogue')" :active="!useMobileLayout && $route.matched.some(
                        (p) => p.name === 'Content-catalogue'
                    )" />
                <div class="nav-spacer"></div>
                <NavItem v-if="!login.user" :label="i18n.global.t(l.nav_login)" @click="navigateTo('/login')" :active="!useMobileLayout && $route.matched.some(
                    (p) => p.name === 'Login'
                )" />
                <NavItem v-if="!login.user" :label="i18n.global.t(l.nav_signup)" @click="navigateTo('/signup')" :active="!useMobileLayout && $route.matched.some(
                    (p) => p.name === 'Signup'
                )" />
                <NavItem v-if="login.user" :label="i18n.global.t(l.nav_profile)" icon="user-profile-mobile margin-left"
                    @click="navigateTo('/profile')" :active="!useMobileLayout && $route.matched.some(
                        (p) => p.name === 'Profile'
                    )" />
                <NavItem :label="i18n.global.t(l.nav_preferences)" icon="settings-mobile" @click="toggleSettingsPanel"
                    :active="!useMobileLayout && UIState.panels.has(
                        UIPanels.Settings
                    )" />
                <Separator v-if="!UIState.isNavMenuCompressed" />
                <NavItem v-if="login.user" :label="i18n.global.t(l.nav_main_menu)" icon="main-menu-mobile"
                    @click="navigateTo('/home')" :active="!useMobileLayout && $route.matched.some(
                        (p) => p.name === 'Login'
                    )" />
            </div>
        </Panel>
    </div>
</template>

<style lang="scss" scoped>
.nav-menu {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    overflow: hidden;
    z-index: 8;
    width: 0px;
    height: 100%;
    margin: 0rem;
    transition: box-shadow 0.25s, width 0.25s, height 0.25s;
    position: absolute;
}

.nav-separator {
    border: 0;
    height: 1rem;
    padding: 1rem;
    margin: 1rem;
    stroke: var(--dividers);
    stroke-width: 4px;
    stroke-dasharray: 2, 15;
}

.nav-menu-open {
    width: 16rem;
    height: 100%;
    background-image: var(--back-ground-texture);

    .nav-menu-list {
        opacity: 1;
    }
}

.nav-menu-bar {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding: 4rem 0rem 1rem 0rem;
    margin: unset;
    overflow: auto;
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
        width: 8rem;
    }
}

.nav-menu-list {
    margin-top: 2rem;
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    align-items: stretch;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: opacity 0.25s 0.25s;
}

.nav-link {
    display: flex;
    align-items: center;
    justify-content: center;
}

.nav-spacer {
    flex-grow: 1;
}

.ui-mode-mobile {
    .menu-container {
        overflow: hidden;
        margin: 0;
        padding: 0;
        height: unset;
    }

    .nav-menu {
        margin: 0;
        font-size: var(--font-small);
    }

    .nav-menu-open {
        width: 65%;
        position: absolute;
    }

    .nav-menu-bar {
        align-items: center;
    }

    .nav-logo {
        width: 50%;
    }

    .short-nav-menu {
        width: 4.5rem;
    }

    .short-nav-menu .nav-item {
        padding: 0rem;
        margin: 1rem;
    }
}
</style>
