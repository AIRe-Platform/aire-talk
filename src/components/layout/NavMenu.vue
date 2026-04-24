<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->

<script setup lang="ts">
import { l } from "@/locales";
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
const darkTheme = useTheme().isDarkTheme();

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
    <nav class="nav-menu" :class="{ 'nav-menu-open': menuOpen, 'nav-menu-compress': menuCompressed }"
        :inert="!menuOpen">
        <Panel class="nav-menu-bar" tabindex="-1">
            <a class="nav-link" href="#" :tabindex="navLinkTabindex" @click="navLogoClick"
                @keydown.space="navLogoClick">
                <img class="nav-logo" src="@/assets/images/aire-logo-letter.svg" :alt=$t(l.nav_menu_alternative_image_logo)
                    v-if="!darkTheme" />
                <img class="nav-logo" src="@/assets/images/aire-logo-letter-dark-mode.svg"
                    :alt=$t(l.nav_menu_alternative_image_logo_dark_mode) v-else />
            </a>
            <div class="nav-menu-list">
                <Separator />
                <template v-if="!isRestrictedMode">
                    <NavItem v-if="login.user" :data-tutorial-state="NavMenuTutorialState.History"
                        @click="toggleChatHistoryMenu" :tabindex="navLinkTabindex" aria-haspopup="true"
                        :aria-expanded="showChatHistory" class="nav-btn chat-history-nav-button"
                        :label="$t(l.nav_chat_history)" icon="chat-history-mobile" :active="showChatHistory"
                        :tooltip="l.nav_chat_history" />
                </template>
                <NavItem v-if="login.user" :tabindex="navLinkTabindex" :label="$t(l.nav_chat)" icon="new-chat-mobile"
                    :title="$t(l.nav_chat)" @click="navigateTo('/chat')" :active="linkActive('Chat')"
                    :tooltip="l.nav_chat" />
                <template v-if="!isRestrictedMode">
                    <NavItem v-if="chat.id" :tabindex="navLinkTabindex" :label="$t(l.nav_chat_new)"
                        icon="new-chat-mobile" @keydown.space="newChat" @click="newChat" :active="false"
                        :tooltip="l.nav_chat_new" />
                    <NavItem v-if="login.user" :tabindex="navLinkTabindex" :label="$t(l.nav_catalogue)"
                        icon="catalogue-content-mobile margin-left" @click="navigateTo('/content-catalogue')"
                        :active="linkActive('Content Catalogue')" :tooltip="l.nav_catalogue" />
                </template>
                <template v-else>
                    <NavItem v-if="login.session?.invite?.allow_upgrade" :tabindex="navLinkTabindex"
                        :label="$t(l.nav_signup)" icon="signup" @click="navigateTo('/signup')"
                        :active="linkActive('Signup')" :tooltip="l.nav_signup" />
                </template>
                <div class="nav-spacer"></div>
                <template v-if="!isRestrictedMode">
                    <NavItem v-if="!login.user" :tabindex="navLinkTabindex" :label="$t(l.nav_login)" icon="login"
                        @click="navigateTo('/login')" :active="linkActive('Login')" :tooltip="l.nav_login" />
                    <NavItem v-if="!login.user" :tabindex="navLinkTabindex" :label="$t(l.nav_signup)" icon="signup"
                        @click="navigateTo('/signup')" :active="linkActive('Signup')" :tooltip="l.nav_signup" />
                    <NavItem v-if="login.user" :data-tutorial-state="NavMenuTutorialState.Profile"
                        :tabindex="navLinkTabindex" :label="$t(l.nav_profile)" icon="user-profile-mobile margin-left"
                        @click="navigateTo('/profile')" :active="linkActive('Profile')" :tooltip="l.nav_profile" />
                </template>
                <NavItem @click="toggleSettingsPanel" class="nav-btn settings-nav-button" :tabindex="navLinkTabindex"
                    :data-tutorial-state="NavMenuTutorialState.Settings" :label="$t(l.nav_preferences)"
                    icon="settings-mobile" :active="showSettings" aria-haspopup="true" :aria-expanded="showSettings"
                    :tooltip="l.nav_preferences" />
                <NavItem :tabindex="navLinkTabindex" :label="$t(l.nav_about)" icon="about" @click="navigateTo('/about')"
                    :active="linkActive('About')" :tooltip="l.nav_about" />
                <Separator />
                <template v-if="!isRestrictedMode">
                    <NavItem v-if="login.user" :tabindex="navLinkTabindex" :label="$t(l.nav_main_menu)"
                        icon="main-menu-mobile" @click="navigateTo('/home')" :active="linkActive('Home')"
                        :tooltip="l.nav_main_menu" />
                </template>
                <template v-else>
                    <NavItem v-if="login.user" :tabindex="navLinkTabindex" :label="$t(l.nav_logout)"
                        :tooltip="$t(l.tooltip_nav_log_out)" icon="logout" @click="login.logout()"
                        :active="linkActive('Logout')" />
                </template>
            </div>
            <div class="popout-panel" v-if="UIState.openPanels().value.length > 0">
                <SettingsPanel v-if="showSettings" />
                <ChatHistory v-if="showChatHistory" />
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
    transition: left .25s, width .25s;
    overflow: hidden;
}

.nav-menu-open {
    left: 0;
}

.nav-menu-compress {
    width: 4.2rem;

    .nav-logo {
        display: none;
    }
}

.nav-menu-list {
    margin-top: 1rem;
    display: flex;
    flex-grow: 1;
    flex-shrink: 1;
    flex-direction: column;
    align-items: stretch;
    overflow: auto;
}

.nav-menu-bar {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    padding: 4rem 0rem 1rem 0rem;
    margin: unset;
    overflow: hidden;
}

.nav-logo {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 3.5rem;
    max-height: 10dvh;
    margin-top: 1rem;
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
    top: 0;
    bottom: 0;
    left: 16rem;
    right: 0rem;
    z-index: 5;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

@media screen and ((max-aspect-ratio: 1/1) or (max-width: 920px)) {
    .popout-panel {
        left: 4rem;
        padding: 0;
    }
}
</style>
