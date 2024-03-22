<script setup lang="ts">
import { l } from "@/locales";
import { Login, logout } from "@/context/login";
import { Chat, createNewChat } from "@/context/chat";
import { router } from "@/router";
import { UIPanels, UIState } from "@/context/ui";
import MenuButton from "./MenuButton.vue";
import ThemeSwitch from "./ThemeSwitch.vue";
import Panel from "./Panel.vue";

const onOpen = (e: Event) => {
    e.stopImmediatePropagation();
    UIState.showMenu = !UIState.showMenu;
};

const toggleChatHistoryMenu = () => {
    UIState.panels.add(UIPanels.ChatHistory);
};

const newChat = async () => {
    await createNewChat();
    navigateTo("/chat");
};

const navigateTo = (path: string) => {
    router.push(path);
    if (window.innerWidth < 600)
        UIState.showMenu = false;
};

const toggleSettingsPanel = () => {
    UIState.panels.add(UIPanels.Settings);
};

const onLogout = async () => {
    await logout();
    router.push("/");
}
</script>

<template>
    <MenuButton :open="UIState.showMenu" @click="onOpen" />
    <div class="nav-menu" :class="{ 'nav-menu-open': UIState.showMenu }">
        <Panel class="nav-menu-bar">
            <div class="nav-link" @click="navigateTo('/')">
                <div class="nav-logo dotted-border-botton">
                    <img src="@/assets/images/aire-logo-letter.svg" alt="Logo" />
                </div>
            </div>
            <div class="nav-menu-list">
                <hr class="nav-separator" />
                <div class="nav-item" @click="navigateTo('/')" :class="{
                    'nav-item-active': $route.matched.some(
                        (p) => p.name === 'Home'
                    ),
                }">
                    <div class="nav-link">{{ $t(l.nav_home) }}</div>
                </div>
                <div class="nav-item" @click="navigateTo('/chat')" v-if="Login.user" :class="{
                    'nav-item-active': $route.matched.some(
                        (p) => p.name === 'Chat'
                    ),
                }">
                    <div class="nav-link">{{ $t(l.nav_chat) }}</div>
                </div>
                <div class="nav-item" @click="newChat" v-if="Chat.id">
                    <div class="nav-link">{{ $t(l.nav_chat_new) }}</div>
                </div>
                <div class="nav-item" @click="toggleChatHistoryMenu" v-if="Login.user" :class="{
                    'nav-item-active': UIState.panels.has(
                        UIPanels.ChatHistory
                    ),
                }">
                    <div class="nav-link">{{ $t(l.nav_chat_history) }}</div>
                </div>
                <div class="nav-spacer"></div>
                <div class="nav-item" @click="navigateTo('/login')" v-if="!Login.user" :class="{
                    'nav-item-active': $route.matched.some(
                        (p) => p.name === 'Login'
                    ),
                }">
                    <div class="nav-link">{{ $t(l.nav_login) }}</div>
                </div>
                <div class="nav-item" @click="navigateTo('/signup')" v-if="!Login.user" :class="{
                    'nav-item-active': $route.matched.some(
                        (p) => p.name === 'Signup'
                    ),
                }">
                    <div class="nav-link">{{ $t(l.nav_signup) }}</div>
                </div>
                <div class="nav-item" @click="navigateTo('/profile')" v-if="Login.user" :class="{
                    'nav-item-active': $route.matched.some(
                        (p) => p.name === 'Profile'
                    ),
                }">
                    <div class="nav-link">{{ $t(l.nav_profile) }}</div>
                </div>
                <hr class="nav-separator" />
                <ThemeSwitch />
                <hr class="nav-separator" />
                <div class="nav-item" @click="toggleSettingsPanel" :class="{
                    'nav-item-active': UIState.panels.has(
                        UIPanels.Settings
                    )
                }">
                    <div class="nav-link">{{ $t(l.nav_preferences) }}</div>
                </div>
                <div class="nav-item" @click="onLogout" v-if="Login.user">
                    <div class="nav-link">{{ $t(l.nav_logout) }}</div>
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
}

.nav-separator {
    border: 0;
    border-bottom: 2px dotted var(--border-color);
    margin: 1rem;
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
    padding: 4rem 0rem 1rem 0rem;
    margin: 1rem;
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
    background-color: var(--border-color);
}

.nav-spacer {
    flex-grow: 1;
}

@media screen and ((max-aspect-ratio: 1/1) or (max-width: 786px)) {
    .menu-container {
        overflow: hidden;
        margin: 0;
        padding: 0;
        height: unset;
    }

    .nav-menu {
        margin: 0;
    }

    .nav-menu-open {
        width: 100%;
    }

    .nav-menu-bar {
        margin: 0.25rem !important;
        align-items: center;
    }

    .nav-logo {
        width: 50%;
    }
}
</style>
