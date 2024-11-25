<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->

<script setup lang="ts">
import i18n, { l } from "@/locales";
import { router } from "@/router";
import { computed, onMounted, onUnmounted, ref } from "vue";
import { UIPanels, UIState } from "@/context/ui";
import ChatHistory from '@/components/chat/ChatHistory.vue';
import SettingsPanel from '@/components/settings/SettingsPanel.vue';
import useLogin from "@/context/login";
import useChat from "@/context/chat";
import Separator from "@/components/common/Separator.vue";
import Panel from "@/components/common/Panel.vue";
import NavItem from "@/components/layout/NavItem.vue";
import NavButton from "@/components/layout/NavButton.vue";
import { closeBurgerMenu } from "@/context/ui";
import { HomeTutorialState, NavMenuTutorialState, TutorialStates } from "@/context/tutorials";
import TutorialPopup from "../common/TutorialPopup.vue";

const login = useLogin();
const chat = useChat();

const isIconsMenu = ref(false);
const navMenuRef = ref<HTMLElement | null>(null);

const onOpen = async (e: Event) => {
    e.stopImmediatePropagation();
    await closeBurgerMenu();
    UIState.showMenu = !UIState.showMenu;
    if (!UIState.showMenu) {
        UIState.isNavMenuCompressed = false;
    }
    if (TutorialStates.home.isLastState())
        TutorialStates.home.skip();
};

const toggleChatHistoryMenu = () => {
    switchMenu();
    UIState.panels.add(UIPanels.ChatHistory);
};

const switchMenu = () => {
    if (!UIState.isNavMenuCompressed) {
        UIState.isNavMenuCompressed = !UIState.isNavMenuCompressed;
        isIconsMenu.value = true;
    }
    else
        isIconsMenu.value = false;
};

const newChat = async () => {
    await chat.startNew();
    await closeBurgerMenu();
    navigateTo("/chat");
};

const navigateTo = async (path: string) => {
    router.push(path);
    await closeBurgerMenu();
    UIState.showMenu = false;
    UIState.isNavMenuCompressed = false;
};

const toggleSettingsPanel = () => {
    switchMenu();
    UIState.panels.add(UIPanels.Settings);
};

const navLogoClick = () => {
    if (login.user)
        navigateTo("/home");
    else
        navigateTo("/");
}

const navLinkTabindex = computed(() => UIState.showMenu ? 0 : -1);

const focusOutListener = async (e: FocusEvent) => {
    const relTarget = e.relatedTarget as Node;
    const target = e.target as Element;
    if (
        !navMenuRef.value?.contains(relTarget) &&
        !target.closest('.modal, .tutorial-buttons')
    ) {
        await closeBurgerMenu();
        UIState.showMenu = false;
        UIState.isNavMenuCompressed = false;
    }
};

onMounted(() => navMenuRef.value?.addEventListener('focusout', focusOutListener));

onUnmounted(() => navMenuRef.value?.removeEventListener('focusout', focusOutListener));
</script>

<template>
    <NavButton id="nav-burger-button"
        :data-tutorial-state="HomeTutorialState.Menu"
        :open="UIState.showMenu"
        @click="onOpen"></NavButton>
    <div class="nav-menu" ref="navMenuRef" :class="{
        'nav-menu-open': UIState.showMenu && !UIState.isClosingMenu, 'short-nav-menu': UIState.isNavMenuCompressed,
        'close-nav-menu-compressed-with-icons': UIState.isClosingMenu && UIState.isNavMenuCompressed && isIconsMenu,
        'close-nav-menu-compressed': UIState.isClosingMenu && UIState.isNavMenuCompressed, 'close-menu-effect': UIState.isClosingMenu
    }">
        <Panel class="nav-menu-bar" tabindex="-1" role="navigation">
            <TutorialPopup class="neg-margin" :tutorial="TutorialStates.nav" v-if="login.user && !TutorialStates.nav.isDone()"/>
            <div class="nav-link"
                :tabindex="navLinkTabindex"
                @keydown.prevent.space.enter="navLogoClick"
                role="link"
                @click="navLogoClick">
                <div class="nav-logo">
                    <img src="@/assets/images/aire-logo-letter.svg" alt="Logo" />
                </div>
            </div>
            <div class="nav-menu-list" :class="{ 'nav-menu-closing-effect': UIState.isClosingMenu }">
                <Separator />
                <NavItem v-if="login.user"
                    :data-tutorial-state="NavMenuTutorialState.History"
                    :tabindex="navLinkTabindex"
                    :label="i18n.global.t(l.nav_chat_history)"
                    icon="chat-history-mobile"
                    @keydown.prevent.space.enter="toggleChatHistoryMenu"
                    @click="toggleChatHistoryMenu"
                    :active="UIState.panels.has(UIPanels.ChatHistory)"
                    aria-haspopup="true"
                    :aria-expanded="UIState.panels.has(UIPanels.ChatHistory)"
                    class="chat-history-nav-button"
                    :tooltip="l.nav_chat_history" />
                <div class="popout-panel" v-if="UIState.panels.has(UIPanels.ChatHistory)">
                    <ChatHistory />
                </div>
                <NavItem v-if="login.user"
                    :tabindex="navLinkTabindex"
                    :label="i18n.global.t(l.nav_chat)"
                    icon="new-chat-mobile"
                    role="link"
                    @keydown.prevent.space.enter="navigateTo('/chat')"
                    :title="$t(l.nav_chat)"
                    @click="navigateTo('/chat')"
                    :active="$route.matched.some((p) => p.name === 'Chat')"
                    :tooltip="l.nav_chat"/>
                <NavItem v-if="chat.id"
                    :tabindex="navLinkTabindex"
                    :label="i18n.global.t(l.nav_chat_new)"
                    icon="new-chat-mobile"
                    role="link"
                    @keydown.prevent.space.enter="newChat"
                    @click="newChat"
                    :active="false"
                    :tooltip="l.nav_chat_new"/>
                <NavItem v-if="login.user"
                    :tabindex="navLinkTabindex"
                    :label="i18n.global.t(l.nav_catalogue)"
                    icon="catalogue-content-mobile margin-left"
                    role="link"
                    @keydown.prevent.space.enter="navigateTo('/content-catalogue')"
                    @click="navigateTo('/content-catalogue')"
                    :active="$route.matched.some((p) => p.name === 'Content-catalogue')"
                    :tooltip="l.nav_catalogue"/>
                <div class="nav-spacer"></div>
                <NavItem v-if="!login.user"
                    :tabindex="navLinkTabindex"
                    :label="i18n.global.t(l.nav_login)"
                    icon="login"
                    role="link"
                    @keydown.prevent.space.enter="navigateTo('/login')"
                    @click="navigateTo('/login')"
                    :active="$route.matched.some((p) => p.name === 'Login')"
                    :tooltip="l.nav_login"/>
                <NavItem v-if="!login.user"
                    :tabindex="navLinkTabindex"
                    :label="i18n.global.t(l.nav_signup)"
                    icon="signup"
                    role="link"
                    @keydown.prevent.space.enter="navigateTo('/signup')"
                    @click="navigateTo('/signup')"
                    :active="$route.matched.some((p) => p.name === 'Signup')"
                    :tooltip="l.nav_signup"/>
                <NavItem v-if="login.user"
                    :data-tutorial-state="NavMenuTutorialState.Profile"
                    :tabindex="navLinkTabindex"
                    :label="i18n.global.t(l.nav_profile)"
                    icon="user-profile-mobile margin-left"
                    role="link"
                    @keydown.prevent.space.enter="navigateTo('/profile')"
                    @click="navigateTo('/profile')"
                    :active="$route.matched.some((p) => p.name === 'Profile')"
                    :tooltip="l.nav_profile"/>
                <NavItem :tabindex="navLinkTabindex"
                    :data-tutorial-state="NavMenuTutorialState.Settings"
                    :label="i18n.global.t(l.nav_preferences)"
                    icon="settings-mobile"
                    @keydown.prevent.space.enter="toggleSettingsPanel"
                    @click="toggleSettingsPanel"
                    :active="UIState.panels.has(UIPanels.Settings)"
                    aria-haspopup="true"
                    :aria-expanded="UIState.panels.has(UIPanels.Settings)"
                    class="settings-nav-button"
                    :tooltip="l.nav_preferences"/>
                <div class="popout-panel" v-if="UIState.panels.has(UIPanels.Settings)">
                    <SettingsPanel />
                </div>
                <NavItem :tabindex="navLinkTabindex"
                    :label="i18n.global.t(l.nav_about)"
                    icon="about"
                    role="link"
                    @keydown.prevent.space.enter="navigateTo('/about')"
                    @click="navigateTo('/about')"
                    :active="$route.matched.some((p) => p.name === 'About')"
                    :tooltip="l.nav_about"/>
                <Separator />
                <NavItem v-if="login.user"
                    :tabindex="navLinkTabindex"
                    :label="i18n.global.t(l.nav_main_menu)"
                    icon="main-menu-mobile"
                    role="link"
                    @keydown.prevent.space.enter="navigateTo('/home')"
                    @click="navigateTo('/home')"
                    :active="$route.matched.some((p) => p.name === 'Home')"
                    :tooltip="l.nav_main_menu" />
            </div>
        </Panel>
    </div>
</template>

<style lang="scss" scoped>
.nav-menu {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    z-index: 8;
    width: 0px;
    height: 100%;
    margin: 0rem;
    transition: box-shadow 0.25s, width 0.25s, height 0.25s;
    //transition: box-shadow 2s, width 2s, height 2s;
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
    cursor: pointer;
}

.nav-spacer {
    flex-grow: 1;
}

@keyframes nav-menu-closing-effect {
    0% {
        opacity: 1;
    }

    100% {
        opacity: 0;
    }
}

.nav-menu-closing-effect {
    animation: nav-menu-closing-effect 0.3s;
}

@keyframes close-menu-effect {
    0% {
        width: 16rem;
    }

    30% {
        width: 16rem;
    }

    100% {
        width: 0rem;
    }
}

.close-menu-effect {
    animation: close-menu-effect 0.6s;
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

    @keyframes nav-menu-closing-effect {
        0% {
            opacity: 1;
        }

        100% {
            opacity: 0;
        }
    }

    .nav-menu-closing-effect {
        animation: nav-menu-closing-effect 0.3s;
    }

    @keyframes close-menu-compressed-effect {
        0% {
            width: 65%;
        }

        30% {
            width: 65%;
        }

        100% {
            width: 0%;
        }
    }

    .close-nav-menu-compressed {
        animation: close-menu-compressed-effect 0.6s;
    }

    @keyframes close-menu-compressed-with-icons-effect {
        0% {
            width: 4.5rem;
        }

        30% {
            width: 4.5rem;
        }

        100% {
            width: 0%;
        }
    }

    .close-nav-menu-compressed-with-icons {
        animation: close-menu-compressed-with-icons-effect 0.6s;
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
