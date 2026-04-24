<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->

<script setup lang="ts">
import i18n, { l } from "@/locales";
import { router } from "@/router";
import { computed } from "vue";
import { UIPanels, UIState, isRestrictedMode } from "@/context/ui";
import ChatHistory from '@/components/chat/ChatHistory.vue';
import SettingsPanel from '@/components/settings/SettingsPanel.vue';
import useLogin from "@/context/login";
import useChat from "@/context/chat";
import Separator from "@/components/common/Separator.vue";
import Panel from "@/components/common/Panel.vue";
import NavItem from "@/components/layout/NavItem.vue";
import NavButton from "@/components/layout/NavButton.vue";
import { HomeTutorialState, NavMenuTutorialState, TutorialStates } from "@/context/tutorials";
import useTheme from "@/context/theme";
import { useRoute } from "vue-router";

const login = useLogin();
const chat = useChat();
const route = useRoute();
const theme = useTheme();

const onOpen = async (e: Event) => {
    e.stopImmediatePropagation();
    UIState.toggleMenu();

    if (TutorialStates.home.isLastState())
        TutorialStates.home.skip();
};

const toggleChatHistoryMenu = () => UIState.openPanel(UIPanels.ChatHistory);
const toggleSettingsPanel = () => UIState.openPanel(UIPanels.Settings);
const showChatHistory = UIState.isPanelOpen(UIPanels.ChatHistory);
const showSettings = UIState.isPanelOpen(UIPanels.Settings);

const menuOpen = UIState.isMenuOpen();
const menuCompressed = UIState.compressMenu();
const iconsOnly = computed(() => menuCompressed.value && UIState.openPanels().value.length > 0);

const newChat = async () => {
    await chat.startNew();
    UIState.closeMenu();
    navigateTo("/chat");
};

const navigateTo = async (path: string) => {
    router.push(path);
    UIState.closeMenu();
};

const navLogoClick = () => {
    if (login.user)
        navigateTo("/home");
    else
        navigateTo("/");
}

const navLinkTabindex = computed(() => UIState.isMenuOpen().value ? 0 : -1);
function linkActive(routeName: string): boolean {
    return UIState.openPanels().value.length === 0 && route.matched.some((p) => p.name === routeName);
}
</script>

<template>
    <NavButton id="nav-burger-button" :data-tutorial-state="HomeTutorialState.Menu" :open="menuOpen" @click="onOpen">
    </NavButton>
    <nav class="nav-menu" :class="{ 'nav-menu-open': menuOpen }" :inert="!menuOpen">
        <Panel class="nav-menu-bar" tabindex="-1">
            <a class="nav-link" href="#" :tabindex="navLinkTabindex" @click="navLogoClick"
                @keydown.space="navLogoClick">
                <div class="nav-logo">
                    <div class="aire-logo" v-if="!theme.isDarkTheme()">
                        <img class="image-logo" src="@/assets/images/aire-logo-letter.svg"
                            :alt=$t(l.nav_menu_alternative_image_logo) />
                    </div>
                    <div class="aire-logo" v-else>
                        <img class="image-logo" src="@/assets/images/aire-logo-letter-dark-mode.svg"
                            :alt=$t(l.nav_menu_alternative_image_logo_dark_mode) />
                    </div>
                </div>
            </a>
            <div class="nav-menu-list">
                <Separator />
                <template v-if="!isRestrictedMode">
                    <NavItem v-if="login.user" :data-tutorial-state="NavMenuTutorialState.History"
                        @click="toggleChatHistoryMenu" :tabindex="navLinkTabindex" aria-haspopup="true"
                        :aria-expanded="showChatHistory" class="nav-btn chat-history-nav-button"
                        :label="i18n.global.t(l.nav_chat_history)" icon="chat-history-mobile" :active="showChatHistory"
                        :tooltip="l.nav_chat_history" item-type="button" />
                    <div class="popout-panel" v-if="showChatHistory">
                        <ChatHistory />
                    </div>
                </template>
                <NavItem v-if="login.user" :tabindex="navLinkTabindex" :label="i18n.global.t(l.nav_chat)"
                    icon="new-chat-mobile" item-type="link" :title="$t(l.nav_chat)" @click="navigateTo('/chat')"
                    :active="linkActive('Chat')" :tooltip="l.nav_chat" />
                <template v-if="!isRestrictedMode">
                    <NavItem v-if="chat.id" :tabindex="navLinkTabindex" :label="i18n.global.t(l.nav_chat_new)"
                        icon="new-chat-mobile" @keydown.space="newChat" @click="newChat" :active="false"
                        :tooltip="l.nav_chat_new" item-type="link" />
                    <NavItem v-if="login.user" :tabindex="navLinkTabindex" :label="i18n.global.t(l.nav_catalogue)"
                        icon="catalogue-content-mobile margin-left" item-type="link"
                        @click="navigateTo('/content-catalogue')" :active="linkActive('Content Catalogue')"
                        :tooltip="l.nav_catalogue" />
                </template>
                <template v-else>
                    <NavItem v-if="login.session?.invite?.allow_upgrade" :tabindex="navLinkTabindex"
                        :label="i18n.global.t(l.nav_signup)" icon="signup" item-type="link"
                        @click="navigateTo('/signup')" :active="linkActive('Signup')" :tooltip="l.nav_signup" />
                </template>
                <div class="nav-spacer"></div>
                <template v-if="!isRestrictedMode">
                    <NavItem v-if="!login.user" :tabindex="navLinkTabindex" :label="i18n.global.t(l.nav_login)"
                        icon="login" @click="navigateTo('/login')" item-type="link" :active="linkActive('Login')"
                        :tooltip="l.nav_login" />
                    <NavItem v-if="!login.user" :tabindex="navLinkTabindex" :label="i18n.global.t(l.nav_signup)"
                        icon="signup" item-type="link" @click="navigateTo('/signup')" :active="linkActive('Signup')"
                        :tooltip="l.nav_signup" />
                    <NavItem v-if="login.user" :data-tutorial-state="NavMenuTutorialState.Profile"
                        :tabindex="navLinkTabindex" :label="i18n.global.t(l.nav_profile)"
                        icon="user-profile-mobile margin-left" item-type="link" @click="navigateTo('/profile')"
                        :active="linkActive('Profile')" :tooltip="l.nav_profile" />
                </template>
                <NavItem @click="toggleSettingsPanel" class="nav-btn settings-nav-button" :tabindex="navLinkTabindex"
                    :data-tutorial-state="NavMenuTutorialState.Settings" :label="i18n.global.t(l.nav_preferences)"
                    icon="settings-mobile" :active="showSettings" aria-haspopup="true" :aria-expanded="showSettings"
                    :tooltip="l.nav_preferences" item-type="button" />
                <div class="popout-panel" v-if="showSettings">
                    <SettingsPanel />
                </div>
                <NavItem :tabindex="navLinkTabindex" :label="i18n.global.t(l.nav_about)" icon="about"
                    @click="navigateTo('/about')" item-type="link" :active="linkActive('About')"
                    :tooltip="l.nav_about" />
                <Separator />
                <template v-if="!isRestrictedMode">
                    <NavItem v-if="login.user" :tabindex="navLinkTabindex" :label="i18n.global.t(l.nav_main_menu)"
                        icon="main-menu-mobile" item-type="link" @click="navigateTo('/home')"
                        :active="linkActive('Home')" :tooltip="l.nav_main_menu" />
                </template>
                <template v-else>
                    <NavItem v-if="login.user" :tabindex="navLinkTabindex" :label="i18n.global.t(l.nav_logout)"
                        icon="logout" item-type="link" @click="login.logout()" :active="linkActive('Logout')" />
                </template>
            </div>
        </Panel>
    </nav>
</template>

<style lang="scss" scoped>
.nav-menu {
    display: flex;
    flex-direction: column;
    flex-shrink: 1;
    position: absolute;
    top: 0;
    bottom: 0;
    width: 16rem;
    left: -16rem;
    z-index: 8;
    transition: left .25s;
    overflow: hidden;
}

.nav-menu-open {
    left: 0;
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

.nav-menu-list {
    margin-top: 2rem;
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    align-items: stretch;
    overflow-y: auto;
    overflow-x: visible;

    background-color: rebeccapurple;
}

.nav-menu-bar {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding: 4rem 0rem 1rem 0rem;
    margin: unset;
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

.nav-link {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.nav-spacer {
    flex-grow: 1;
}

.popout-panel {
    position: fixed;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 1rem;
    top: 0;
    bottom: 0;
    z-index: 5;
}

@media screen and ((max-aspect-ratio: 1/1) or (max-width: 920px)) {
    .menu-container {
        overflow: hidden;
        margin: 0;
        padding: 0;
        height: unset;
    }

    .nav-menu {
        margin: 0;
        //font-size: var(--font-small);
    }

    .short-nav-menu .separator {
        display: none;
    }

    .nav-menu-open {
        width: 16rem;
        position: absolute;
    }

    .nav-menu-bar {
        align-items: center;
    }

    .short-nav-menu .nav-logo img {
        width: 90%
    }

    .short-nav-menu {
        width: 4.5rem;
    }

    .short-nav-menu .nav-menu-bar {
        overflow: hidden;
    }

    .nav-item {
        padding: 0rem;
        margin: 1rem;
    }

    .popout-panel {
        bottom: 0rem;
        left: 0;
        right: 0;

        align-items: center;
        justify-content: center;
    }
}
</style>
