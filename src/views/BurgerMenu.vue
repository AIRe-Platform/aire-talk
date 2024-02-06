<script setup lang="ts">
import { defineComponent, ref } from 'vue';
import { vOnClickOutside } from '@vueuse/components'
import { l } from '@/locales';
import { RouterLink } from 'vue-router';
import { Login, logout } from '@/context/login';
import { createNewChat } from '@/context/chat';
import { router } from '@/router';
import ChatHistory from '@/components/ChatHistory.vue';
defineComponent({ name: "BurgerMenuView" })

const isChatHistoryOpen = ref(false);
const isCatologueContentOpen = ref(false);

let isBurgerMenuOpen = ref(false);

const toggleMenu = () => {
    isBurgerMenuOpen.value = !(isBurgerMenuOpen.value);
    if (isBurgerMenuOpen.value === false) {
        isChatHistoryOpen.value = false;
        isCatologueContentOpen.value = false;
    }
};

const onBlur = () => {
    isBurgerMenuOpen.value = false;
    isChatHistoryOpen.value = false;
    isCatologueContentOpen.value = false;
};

const toggleChatHistoryMenu = async (e?: Event) => {
    e?.preventDefault();

    isChatHistoryOpen.value = !(isChatHistoryOpen.value);
    isCatologueContentOpen.value = false;

    if (!isChatHistoryOpen.value)
        onBlur()
};

/**
 * Create a new chat
 */
const newChat = async (e?: Event) => {
    e?.preventDefault();
    await createNewChat()
    onBlur();
    router.push("/chat")
};
</script>

<template>
    <div v-on-click-outside="onBlur">
        <div class="burger-menu-menu">
            <div class="burger-menu-button" id="burger" :class="{
                'active': isBurgerMenuOpen
            }" @click="toggleMenu">
                <button type="button" class="burger-button" title="Menu">
                    <span class="burger-bar burger-bar--1"></span>
                    <span class="burger-bar burger-bar--2"></span>
                    <span class="burger-bar burger-bar--3"></span>
                </button>
            </div>
            <div id="navbarNav" v-show="isBurgerMenuOpen">
                <RouterLink class="nav-link" to="/" @click="toggleMenu">
                    <div class="nav-logo">
                        <img src="@/assets/logos/AIRE-Platform-Logo-400x400.png" alt="Logo">
                    </div>
                </RouterLink>
                <div class="nav-menu-list">
                    <div class="nav-item" @click="toggleChatHistoryMenu" v-if="Login.logged_in">
                        <a class="nav-link" href="#">{{ $t(l.burger_menu_chat_log_history) }}</a>
                    </div>
                    <!--
                    <div class="nav-item" @click="toggleCatalogueContentMenu">
                        <a class="nav-link" href="#">{{ $t(l.burger_menu_content_catalogue) }}</a>
                    </div>
                    -->
                    <div class="nav-item" @click="newChat">
                        <a class="nav-link" href="#"> {{ $t(l.burger_menu_new_chat) }} </a>
                    </div>
                    <div class="nav-item burger-menu-button-nav-item" @click="toggleMenu">
                        <RouterLink v-if="Login.logged_in === false" class="nav-link" to="/login">{{
                            $t(l.burger_menu_sign_in) }}</RouterLink>
                        <RouterLink v-if="Login.logged_in === true" class="nav-link" to="/profile">{{
                            $t(l.burger_menu_current_user) }}</RouterLink>
                    </div>
                    <div class="nav-item burger-menu-button-nav-item" v-if="Login.logged_in === false" @click="toggleMenu">
                        <RouterLink class="nav-link" to="/signup">{{ $t(l.burger_menu_sign_up) }}</RouterLink>
                    </div>
                    <div class="nav-item" @click="toggleMenu" v-if="Login.logged_in === true">
                        <a href="#" class="nav-link" @click="logout">{{ $t(l.burger_menu_log_out) }}</a>
                    </div>
                    <div class="nav-item" @click="toggleMenu">
                        <RouterLink class="nav-link" to="/settings">{{ $t(l.burger_menu_settings) }}</RouterLink>
                    </div>
                </div>
            </div>
        </div>
        <ChatHistory v-if="isChatHistoryOpen" :onClosePanel="toggleChatHistoryMenu" />
        <!--

        -->
    </div>
    <div class="burger-menu-blur" v-if="isBurgerMenuOpen">
    </div>
</template>

<style scoped lang="scss">
$burger-color: var(--text-color);
$primary: var(--background-color);

.burger-menu-blur {
    z-index: 1;
    background: rgba(255, 255, 255, .7);
    opacity: 0.4;
    height: 100%;
    width: 100vw;
    position: fixed;
}

.burger-menu-menu {
    background-color: var(--panel-background-color);
    position: absolute;
    padding: 1rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
    width: auto;
    border-radius: 10px;
    z-index: 2;
    margin-left: 1rem;
}

.nav-logo {
    width: 5rem;
    height: 5rem;
    margin-left: 2.5rem;
}

.nav-menu-list {
    margin-top: 2rem;
}

.nav-item {
    padding: 1rem;
    display: flex;
    justify-content: center;
    cursor: pointer;
}

.burger-menu-button-nav-item {
    margin-top: 10rem;
}

.nav-logo {
    margin-top: 2rem;
    display: flex;
    justify-content: center;
}

.burger-button {
    position: relative;
    height: 30px;
    width: 40px;
    display: block;
    z-index: 99;
    border: 0;
    border-radius: 0;
    background-color: transparent;
    pointer-events: all;
    transition: transform .6s cubic-bezier(.165, .84, .44, 1);
    cursor: pointer;
}

.burger-bar {
    background-color: $burger-color;
    position: absolute;
    top: 50%;
    right: 6px;
    left: 6px;
    height: 3px;
    width: auto;
    margin-top: -1px;
    transition: transform .6s cubic-bezier(.165, .84, .44, 1), opacity .3s cubic-bezier(.165, .84, .44, 1), background-color .6s cubic-bezier(.165, .84, .44, 1);
}

.burger-bar--1 {
    -webkit-transform: translateY(-6px);
    transform: translateY(-6px);
    top: 40%;
}

.burger-bar--2 {
    transform-origin: 100% 50%;
    transform: scaleX(1);
}

.burger-button:hover .burger-bar--2 {
    transform: scaleX(1);
}

.no-touchevents .burger-bar--2:hover {
    transform: scaleX(1);
}

.burger-bar--3 {
    transform: translateY(6px);
    top: 60%;
}

#burger.active .burger-button {
    transform: rotate(-180deg);
}

#burger.active .burger-bar--1 {
    transform: rotate(45deg);
    top: 50%;
}

#burger.active .burger-bar--2 {
    opacity: 0;
}

#burger.active .burger-bar--3 {
    transform: rotate(-45deg);
    top: 50%;
}

/* mobile*/
@media screen and (max-width: 600px) {
    .burger-menu-menu {
        margin-left: 1rem;
    }

    .burger-menu-button {
        width: 1rem;
    }

    .burger-button {
        width: auto;
        height: auto;
    }

    .burger-bar {
        width: 1.5rem;
        left: -0.2rem;
    }

    #burger.active .burger-button {
        left: -0.9rem;
    }

    .burger-menu-button-nav-item {
        margin-top: 0;
    }
}
</style>
