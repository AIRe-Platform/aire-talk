<script setup lang="ts">
import i18n, { l } from "@/locales";
import { Login } from "@/context/login";
import { Chat, createNewChat } from "@/context/chat";
import { router } from "@/router";
import { UIPanels, UIState } from "@/context/ui";
import MenuButton from "./MenuButton.vue";
import Panel from "./Panel.vue";
import useMobileLayout from "@/helpers/mobile";
import SectionSeparator from "./SectionSeparator.vue";
import NavItem from "./NavItem.vue";

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
    await createNewChat();
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
    <MenuButton :open="UIState.showMenu" @click="onOpen"></MenuButton>
    <div class="nav-menu" :class="{ 'nav-menu-open': UIState.showMenu, 'short-nav-menu': UIState.isNavMenuCompressed }">
        <Panel class="nav-menu-bar">
            <div class="nav-link" v-if="Login.user" @click="navigateTo('/home')">
                <div class="nav-logo" v-if="!useMobileLayout">
                    <img src="@/assets/images/aire-logo-letter.svg" alt="Logo" />
                </div>
            </div>
            <div class="nav-link" v-if="!Login.user" @click="navigateTo('/')">
                <div class="nav-logo">
                    <img src="@/assets/images/aire-logo-letter.svg" alt="Logo" />
                </div>
            </div>
            <div class="nav-menu-list">
                <SectionSeparator v-if="!UIState.isNavMenuCompressed" />
                <NavItem v-if="Login.user" :label="i18n.global.t(l.nav_chat_history)" icon="chat-history-mobile"
                    @click="toggleChatHistoryMenu"
                    :active="!useMobileLayout && UIState.panels.has(UIPanels.ChatHistory)" />
                <NavItem v-if="Login.user" :label="i18n.global.t(l.nav_chat)" icon="new-chat-mobile"
                    @click="navigateTo('/chat')" :active="!useMobileLayout && $route.matched.some(
                        (p) => p.name === 'Chat'
                    )" />
                <NavItem v-if="Chat.id" :label="i18n.global.t(l.nav_chat_new)" icon="new-chat-mobile" @click="newChat"
                    :active="!useMobileLayout && $route.matched.some(
                        (p) => p.name === 'Chat'
                    )" />
                <NavItem v-if="Login.user" :label="i18n.global.t(l.nav_catalogue)"
                    icon="catalogue-content-mobile margin-left" @click="navigateTo('/content-catalogue')" :active="!useMobileLayout && $route.matched.some(
                        (p) => p.name === 'Content-catalogue'
                    )" />
                <div class="nav-spacer"></div>
                <NavItem v-if="!Login.user" :label="i18n.global.t(l.nav_login)" @click="navigateTo('/login')" :active="!useMobileLayout && $route.matched.some(
                    (p) => p.name === 'Login'
                )" />
                <NavItem v-if="!Login.user" :label="i18n.global.t(l.nav_signup)" @click="navigateTo('/signup')" :active="!useMobileLayout && $route.matched.some(
                    (p) => p.name === 'Signup'
                )" />
                <NavItem v-if="Login.user" :label="i18n.global.t(l.nav_profile)" icon="user-profile-mobile margin-left"
                    @click="navigateTo('/profile')" :active="!useMobileLayout && $route.matched.some(
                        (p) => p.name === 'Profile'
                    )" />
                <NavItem v-if="true" :label="i18n.global.t(l.nav_preferences)" icon="settings-mobile"
                    @click="toggleSettingsPanel" :active="!useMobileLayout && UIState.panels.has(
                        UIPanels.Settings
                    )" />
                <SectionSeparator v-if="!UIState.isNavMenuCompressed" />
                <NavItem v-if="Login.user" :label="i18n.global.t(l.nav_main_menu)" icon="main-menu-mobile"
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
