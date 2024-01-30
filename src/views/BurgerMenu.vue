<script setup lang="ts">
import { defineComponent, ref } from 'vue';
import { vOnClickOutside } from '@vueuse/components'
import { l } from '@/locales';
import { RouterLink } from 'vue-router';
import { Login, logout } from '@/context/login';
import { Chat } from '@/context/chat';
import ChatHistory from '@/components/ChatHistory.vue'
import CatalogueContent from '@/components/CatalogueContent.vue';
import { AireChatMetadata } from "@/lib/aire/models/chat";
defineComponent({ name: "BurgerMenuView" })

const { DateTime } = require("luxon");
const isChatHistoryOpen = ref(false);
const isCatologueContentOpen = ref(false);
const isRestoreChatOpen = ref(false);
let chats = ref<AireChatMetadata[]>();

//to Toggle menu
let isBurgerMenuOpen = ref(false);
/**
 * Toggle the burger menu and send it to main view.
 */
const toggleMenu = () => {
    isBurgerMenuOpen.value = !(isBurgerMenuOpen.value);
    if (isBurgerMenuOpen.value === false) {
        isChatHistoryOpen.value = false;
        isCatologueContentOpen.value = false;
        isRestoreChatOpen.value = false;
    }
};

const onBlur = () => {
    isBurgerMenuOpen.value = false;
    isChatHistoryOpen.value = false;
    isCatologueContentOpen.value = false;
    isRestoreChatOpen.value = false;
};

/**
 * Save the current chat to the ddbb. takes the chat_id from Chat.chat_id
 */
const onSaveChat = async (e?: Event) => {
    e?.preventDefault();
    await Chat.saveChatHistory();
};

/**
 * Restore chat from the ddbb with the chat.id given. SAve the current chat first
*/
const onLoadChat = async (chat: AireChatMetadata) => {
    if (Chat.history.length > 1) {
        await onSaveChat();
    }
    Chat.loadChatHistory(chat.id);
    isRestoreChatOpen.value = false;
};

/**
 * Toggle the Chat History Menu and send it to main view.
 */
const toggleChatHistoryMenu = (e: Event) => {
    e.preventDefault();
    isChatHistoryOpen.value = !(isChatHistoryOpen.value);
    isCatologueContentOpen.value = false;
    isRestoreChatOpen.value = false;
};

/**
* Toggle the Restore Chat menu and get all the chats that has this user from the backend. All but the current chat
*/
const toggleRestoreChatMenu = async (e: Event) => {
    e.preventDefault();
    isRestoreChatOpen.value = !(isRestoreChatOpen.value);
    isCatologueContentOpen.value = false;
    isChatHistoryOpen.value = false;
    chats.value = await Chat.getAllChats();
    chats.value.splice(chats.value.findIndex((chat) => chat.id === Chat.chat_id), 1);
};
/**
 * Toggle the catalogue content Menu and send it to main view.
 */
const toggleCatalogueContentMenu = (e: Event) => {
    e.preventDefault();
    isCatologueContentOpen.value = !(isCatologueContentOpen.value);
    isChatHistoryOpen.value = false;
    isRestoreChatOpen.value = false;
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
                    <div class="nav-item" @click="toggleChatHistoryMenu">
                        <a class="nav-link" href="#">{{ $t(l.burger_menu_chat_log_history) }}</a>
                    </div>
                    <div class="nav-item" @click="toggleCatalogueContentMenu">
                        <a class="nav-link" href="#">{{ $t(l.burger_menu_content_catalogue) }}</a>
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
                    <div class="nav-item" v-if="Login.logged_in === true">
                        <a href="#" class="nav-link" @click="onSaveChat">{{ $t(l.burger_menu_save_chat) }}</a>
                    </div>
                    <div class="nav-item" v-if="Login.logged_in === true">
                        <div class="nav-item" @click="toggleRestoreChatMenu">
                            <a class="nav-link" href="#">{{ $t(l.burger_menu_restore_chat) }}</a>
                        </div>
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
        <div class="burger-menu-menu-chat-history" v-if="isChatHistoryOpen">
            <div class="burger-menu-menu-chat-history-top-row">
                <h1>{{ $t(l.burger_menu_chat_history) }} </h1>
                <div class="burger-menu-menu-chat-history-close-button hide-big-screen-devices"
                    @click="toggleChatHistoryMenu">
                    <font-awesome-icon icon="fa-solid fa-xmark" />
                </div>
            </div>
            <div class="burger-menu-menu-chat-history-chat-content">
                <div class="burger-menu-menu-chat-history-chat" v-for="(msg) in Chat.history" v-bind:key="msg.timestamp">
                    <div class="burger-menu-menu-chat-history-chat-bubble-assistant" v-if="msg.role == 'assistant'">
                        <ChatHistory :message="msg" />
                    </div>
                    <div class="burger-menu-menu-chat-history-chat-bubble-user" v-if="msg.role == 'user'">
                        <ChatHistory :message="msg" />
                    </div>
                </div>
            </div>
        </div>
        <div class="burger-menu-menu-catalogue-content" v-if="isCatologueContentOpen">
            <div class="burger-menu-menu-catalogue-content-top-row">
                <h1>{{ $t(l.burger_menu_catalogue_content) }}</h1>
                <div class="burger-menu-menu-catalogue-content-close-button hide-big-screen-devices"
                    @click="toggleCatalogueContentMenu">
                    <font-awesome-icon icon="fa-solid fa-xmark" />
                </div>
            </div>
            <div class="burger-menu-menu-catalogue-content-chat-content">
                <div class="burger-menu-menu-chat-history-chat-catalogue-content" v-for="(msg) in Chat.history"
                    v-bind:key="msg.timestamp">
                    <div class="burger-menu-menu-chat-history-chat-bubble-assistant" v-if="msg.role == 'assistant'">
                        <CatalogueContent :message="msg" />
                    </div>
                </div>
            </div>
        </div>
        <div class="burger-menu-menu-restore-chat" v-if="isRestoreChatOpen">
            <div class="burger-menu-menu-restore-chat-top-row">
                <!--             <h1>{{ $t(l.burger_menu_catalogue_content) }}</h1> -->
                <h1> restore chats:</h1>
                <div class="burger-menu-menu-restore-chat-close-button hide-big-screen-devices"
                    @click="toggleRestoreChatMenu">
                    <font-awesome-icon icon="fa-solid fa-xmark" />
                </div>
            </div>
            <div class="burger-menu-menu-restore-chat-content">
                <div class="burger-menu-menu-restore-chat-content" v-for="chat in chats" v-bind:key="chat.id">
                    <button class="burger-menu-menu-restore-chat-row" @click="onLoadChat(chat)">
                        {{ DateTime.fromISO(chat.time).toFormat('hh:mm:ss - dd.MM.yyyy') }}
                    </button>
                </div>
            </div>
        </div>
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

.burger-menu-menu-chat-history {
    background-color: var(--panel-background-color);
    position: absolute;
    margin-top: 2rem;
    left: 13rem;
    height: 27.5rem;
    width: 55%;
    padding: 4rem;
    border-radius: 10px;
    z-index: 2;
    overflow: scroll;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
}

.burger-menu-menu-chat-history-chat {
    width: 100%;
}

.burger-menu-menu-chat-history-chat-bubble-assistant {
    display: flex;
    justify-content: flex-start;
}

.burger-menu-menu-restore-chat-row {
    cursor: pointer;
}

.burger-menu-menu-chat-history-chat-bubble-user {
    display: flex;
    justify-content: flex-end;
}

.burger-menu-menu-catalogue-content {
    background-color: var(--panel-background-color);
    position: absolute;
    margin-top: 2rem;
    left: 13rem;
    height: 27.5rem;
    width: 55%;
    padding: 4rem;
    border-radius: 10px;
    z-index: 2;
    overflow: scroll;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
}

.burger-menu-menu-restore-chat {
    background-color: var(--panel-background-color);
    position: absolute;
    margin-top: 2rem;
    left: 13rem;
    height: 27.5rem;
    width: 55%;
    padding: 4rem;
    border-radius: 10px;
    z-index: 2;
    overflow: scroll;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
}

.burger-menu-menu-restore-chat-content {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 1rem;
}

/* mobile*/
@media screen and (max-width: 600px) {
    .burger-menu-menu {
        margin-left: 1rem;
    }

    .burger-menu-button {
        width: 1rem;
    }

    .chat-input-wrapper {
        width: 89%;
        margin-bottom: 1rem;
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

    .burger-menu-menu-chat-history {
        margin-top: 1rem;
        left: 0.5rem;
        height: 94%;
        width: 92%;
        padding: 0.5rem;
    }

    .burger-menu-menu-chat-history-top-row {
        display: flex;
        align-items: center;
        position: fixed;
        justify-content: space-around;
        width: 94%;
        background-color: var(--panel-background-color);
        top: 1rem;
        z-index: 1;
        border-radius: 10px;
    }

    .burger-menu-menu-chat-history-chat-content {
        position: relative;
        top: 3.5rem;
    }

    .burger-menu-menu-catalogue-content .burger-menu-menu-restore-chat {
        margin-top: 1rem;
        left: 0.5rem;
        height: 94%;
        width: 92%;
        padding: 0.5rem;
    }

    .burger-menu-menu-catalogue-content-top-row .burger-menu-menu-restore-chat-top-row {
        display: flex;
        align-items: center;
        position: fixed;
        justify-content: space-around;
        width: 94%;
        background-color: var(--panel-background-color);
        top: 1rem;
        z-index: 1;
        border-radius: 10px;
    }

    .burger-menu-menu-catalogue-content-chat-content .burger-menu-menu-restore-chat-content {
        position: relative;
        top: 3.5rem;
    }

    .burger-menu-menu-chat-history-chat-catalogue-content .burger-menu-menu-chat-history-chat-catalogue-content {
        width: 60%;
    }

    .burger-menu-button-nav-item {
        margin-top: 0;
    }
}
</style>