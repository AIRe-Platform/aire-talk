<script setup lang="ts">
import { l } from "@/locales";
import { Login } from "@/context/login";
import { Chat, createNewChat } from "@/context/chat";
import { router } from "@/router";
import { UIPanels, UIState, UISettings } from "@/context/ui";
import MenuButton from "./MenuButton.vue";
import Panel from "./Panel.vue";
import useMobileLayout from "@/helpers/mobile";
import SectionSeparator from "./SectionSeparator.vue";

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
    if (useMobileLayout() || UISettings.screenSize == 'mobile-screen') {
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
    <MenuButton :open="UIState.showMenu" @click="onOpen"
        :class="{ 'menu-button-open-fake-mobile-screen': UISettings.screenSize == 'mobile-screen' }"></MenuButton>
    <div class="nav-menu"
        :class="{ 'nav-menu-open': UIState.showMenu, 'short-nav-menu': UIState.isNavMenuCompressed, 'fake-mobile-screen': UISettings.screenSize == 'mobile-screen' && UIState.showMenu, 'short-nav-fake-mobile-screen': UISettings.screenSize == 'mobile-screen' && UIState.isNavMenuCompressed }">
        <Panel class="nav-menu-bar">
            <div class="nav-link" v-if="Login.user" @click="navigateTo('/home')">
                <div class="nav-logo"
                    v-if="(!useMobileLayout() && UISettings.screenSize != 'mobile-screen') || (useMobileLayout() && !UIState.isNavMenuCompressed) || (!useMobileLayout() && UISettings.screenSize == 'mobile-screen' && !UIState.isNavMenuCompressed)">
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
                <div class="nav-item" @click="toggleChatHistoryMenu" v-if="Login.user"
                    :class="{ 'nav-item-active': !useMobileLayout() && UIState.panels.has(UIPanels.ChatHistory), 'small-layout': UIState.isNavMenuCompressed }">
                    <div class="nav-link"
                        v-if="(!useMobileLayout() && UISettings.screenSize != 'mobile-screen') || (useMobileLayout() && !UIState.isNavMenuCompressed) || (!useMobileLayout() && UISettings.screenSize == 'mobile-screen' && !UIState.isNavMenuCompressed)">
                        {{ $t(l.nav_chat_history) }}
                    </div>
                    <div class="icon chat-history-mobile"
                        v-if="(useMobileLayout() && UIState.isNavMenuCompressed) || (UISettings.screenSize == 'mobile-screen' && UIState.isNavMenuCompressed)">
                    </div>
                </div>
                <div class="nav-item" @click="navigateTo('/chat')" v-if="Login.user" :class="{
                    'nav-item-active': !useMobileLayout() && $route.matched.some(
                        (p) => p.name === 'Chat'
                    ), 'small-layout': UIState.isNavMenuCompressed
                }">
                    <div class="nav-link"
                        v-if="(!useMobileLayout() && UISettings.screenSize != 'mobile-screen') || (useMobileLayout() && !UIState.isNavMenuCompressed) || (!useMobileLayout() && UISettings.screenSize == 'mobile-screen' && !UIState.isNavMenuCompressed)">
                        {{ $t(l.nav_chat) }}
                    </div>
                    <div class="icon new-chat-mobile"
                        v-if="(useMobileLayout() && UIState.isNavMenuCompressed) || (UISettings.screenSize == 'mobile-screen' && UIState.isNavMenuCompressed)">
                    </div>
                </div>
                <div class="nav-item" @click="newChat" :class="{
                    'small-layout': UIState.isNavMenuCompressed
                }" v-if="Chat.id">
                    <div class="nav-link"
                        v-if="(!useMobileLayout() && UISettings.screenSize != 'mobile-screen') || (useMobileLayout() && !UIState.isNavMenuCompressed) || (!useMobileLayout() && UISettings.screenSize == 'mobile-screen' && !UIState.isNavMenuCompressed)">
                        {{ $t(l.nav_chat_new) }}
                    </div>
                    <div class="icon new-chat-mobile"
                        v-if="(useMobileLayout() && UIState.isNavMenuCompressed) || (UISettings.screenSize == 'mobile-screen' && UIState.isNavMenuCompressed)">
                    </div>
                </div>
                <div class="nav-item" @click="navigateTo('/content-catalogue')" v-if="Login.user" :class="{
                    'nav-item-active': !useMobileLayout() && $route.matched.some(
                        (p) => p.name === 'Content-catalogue'
                    ), 'small-layout': UIState.isNavMenuCompressed
                }">
                    <div class="nav-link"
                        v-if="(!useMobileLayout() && UISettings.screenSize != 'mobile-screen') || (useMobileLayout() && !UIState.isNavMenuCompressed) || (!useMobileLayout() && UISettings.screenSize == 'mobile-screen' && !UIState.isNavMenuCompressed)">
                        {{ $t(l.nav_catalogue) }}
                    </div>
                    <div class="icon catalogue-content-mobile margin-left"
                        v-if="(useMobileLayout() && UIState.isNavMenuCompressed) || (UISettings.screenSize == 'mobile-screen' && UIState.isNavMenuCompressed)">
                    </div>
                </div>
                <div class="nav-spacer"></div>
                <div class="nav-item" @click="navigateTo('/login')" v-if="!Login.user" :class="{
                    'nav-item-active': !useMobileLayout() && $route.matched.some(
                        (p) => p.name === 'Login'
                    ),
                }">
                    <div class="nav-link">{{ $t(l.nav_login) }}</div>
                </div>
                <div class="nav-item" @click="navigateTo('/signup')" v-if="!Login.user" :class="{
                    'nav-item-active': !useMobileLayout() && $route.matched.some(
                        (p) => p.name === 'Signup'
                    ),
                }">
                    <div class="nav-link">{{ $t(l.nav_signup) }}</div>
                </div>
                <div class="nav-item" @click="navigateTo('/profile')" v-if="Login.user" :class="{
                    'nav-item-active': !useMobileLayout() && $route.matched.some(
                        (p) => p.name === 'Profile'
                    ), 'small-layout': UIState.isNavMenuCompressed
                }">
                    <div class="nav-link"
                        v-if="(!useMobileLayout() && UISettings.screenSize != 'mobile-screen') || (useMobileLayout() && !UIState.isNavMenuCompressed) || (!useMobileLayout() && UISettings.screenSize == 'mobile-screen' && !UIState.isNavMenuCompressed)">
                        {{ $t(l.nav_profile) }}
                    </div>
                    <div class="icon user-profile-mobile margin-left"
                        v-if="(useMobileLayout() && UIState.isNavMenuCompressed) || (UISettings.screenSize == 'mobile-screen' && UIState.isNavMenuCompressed)">
                    </div>
                </div>
                <div class="nav-item" @click="toggleSettingsPanel" :class="{
                    'nav-item-active': !useMobileLayout() && UIState.panels.has(
                        UIPanels.Settings
                    ), 'small-layout': UIState.isNavMenuCompressed
                }">
                    <div class="nav-link"
                        v-if="(!useMobileLayout() && UISettings.screenSize != 'mobile-screen') || (useMobileLayout() && !UIState.isNavMenuCompressed) || (!useMobileLayout() && UISettings.screenSize == 'mobile-screen' && !UIState.isNavMenuCompressed)">
                        {{ $t(l.nav_preferences) }}
                    </div>
                    <div class="icon settings-mobile"
                        v-if="(useMobileLayout() && UIState.isNavMenuCompressed) || (UISettings.screenSize == 'mobile-screen' && UIState.isNavMenuCompressed)">
                    </div>
                </div>
                <SectionSeparator v-if="!UIState.isNavMenuCompressed" />
                <div class="nav-item" @click="navigateTo('/home')" :class="{
                    'small-layout': UIState.isNavMenuCompressed
                }" v-if="Login.user">
                    <div class="nav-link"
                        v-if="(!useMobileLayout() && UISettings.screenSize != 'mobile-screen') || (useMobileLayout() && !UIState.isNavMenuCompressed) || (!useMobileLayout() && UISettings.screenSize == 'mobile-screen' && !UIState.isNavMenuCompressed)">
                        {{ $t(l.nav_main_menu) }}
                    </div>
                    <div class="icon main-menu-mobile"
                        v-if="(useMobileLayout() && UIState.isNavMenuCompressed) || (UISettings.screenSize == 'mobile-screen' && UIState.isNavMenuCompressed)">
                    </div>
                </div>
            </div>
        </Panel>
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

.nav-item {
    padding: 1rem;
    display: flex;
    justify-content: center;
    cursor: pointer;
    text-align: center;
    font-weight: bold;
}

.nav-link {
    display: flex;
    align-items: center;
    justify-content: center;
}

.nav-item-active {
    background-color: var(--menu-active);
}

.nav-spacer {
    flex-grow: 1;
}

.fake-mobile-screen {
    height: 78%;
    width: 10rem;
}

.short-nav-fake-mobile-screen {
    width: 5rem;
}

.menu-button-open-fake-mobile-screen {
    left: 0.5rem;
}

@media screen and ((max-aspect-ratio: 1/1) or (max-width: 920px)) {
    .menu-container {
        overflow: hidden;
        margin: 0;
        padding: 0;
        height: unset;
    }

    .nav-item {
        padding: 2rem;
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

    .small-layout {
        padding: 0rem;
        margin: 1rem;
    }
}
</style>
