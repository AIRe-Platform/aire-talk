<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->


<script setup lang="ts">
import { l } from '@/locales';
import { router } from '@/router';
import { onMounted, reactive } from 'vue';
import { getAllChats } from '@/helpers/chatUtils';
import useLogin from '@/context/login';
import useChat from '@/context/chat';
import useTheme, { ThemeContext } from "@/context/theme";

import DialogModal from "@/components/layout/DialogModal.vue";
import ReminderComponent from "@/components/common/Reminder.vue";
import { HomeTutorialState } from '@/context/tutorials';

const login = useLogin();
const chat = useChat();

const state = reactive<{
    showConfirmLogout: boolean,
    showLastChatButton: boolean,
    isLoadingView: boolean,
    theme: ThemeContext,
}>({
    showConfirmLogout: false,
    showLastChatButton: false,
    isLoadingView: true,
    theme: new ThemeContext()
});

const onConfirmLogout = async () => {
    state.showConfirmLogout = false;
    await login.logout();
    router.push("/");
}

const newChat = async () => {
    await chat.startNew();
    navigateTo("/chat");
};

const getLastChatId = async () => {
    const chats = await getAllChats();
    return chats[0]?.id;
}

const openLastChat = async () => {
    const last = await getLastChatId();
    router.push({ name: "Chat", params: { id: last } });
}

const navigateTo = (path: string) => {
    router.push(path)
}

onMounted(async () => {
    state.theme = useTheme();
    const last = await getLastChatId();
    state.showLastChatButton = (last !== undefined);
    state.isLoadingView = false;
})
</script>

<template>
    <div id="home-view" v-if="!state.isLoadingView">
        <div class="home-container">
            <div class="home-header">
                <h1 class="visually-hidden">{{ $t(l.home_title) }}</h1>
                <div class="home-header-title">
                    <div class="aire-logo" v-if="state.theme.style == 'theme-default'">
                        <img class="image-logo" src="@/assets/images/aire-logo-letter.svg" alt="AIRe homepage logo" />
                    </div>
                    <div class="aire-logo" v-else>
                        <img class="image-logo" src="@/assets/images/aire-logo-letter-dark-mode.svg"
                            alt="AIRe homepage logo in dark mode" />
                    </div>
                    <h2 class="header-text">{{ $t(l.start_first_paragraph) }}</h2>
                </div>
            </div>
            <ReminderComponent />
            <div class="quick-nav">
                <a class="icon frontpage-button" :data-tutorial-state="HomeTutorialState.StartChat"
                    href="#" @keydown.space="newChat()" @click="newChat()">
                    {{ $t(l.home_start_new_chat) }}
                </a>
                <a class="icon frontpage-button"
                    href="#" @keydown.space="openLastChat()" @click="openLastChat()"
                    v-if="state.showLastChatButton">
                    {{ $t(l.home_continue_chat) }}
                </a>
                <button class="icon frontpage-button"
                    @click="state.showConfirmLogout = !state.showConfirmLogout">
                    {{ $t(l.nav_logout) }}
                </button>
            </div>
            <div class="home-footer">
                <p class="disclaimer" :data-tutorial-state="HomeTutorialState.Welcome">{{ $t(l.start_footer)
                    }}<br /><b>{{ $t(l.start_disclaimer) }}</b></p>
                <div class="chat-bot">
                </div>
            </div>
        </div>
    </div>
    <DialogModal :active="state.showConfirmLogout" @focus-first-button="(btn: HTMLElement | null) => btn?.focus()"
        :buttons="[
            { loc_key: l.button_accept, onClick: onConfirmLogout },
            { loc_key: l.button_cancel, className: 'cancel-button', onClick: () => { state.showConfirmLogout = false; } }
        ]">
        {{ $t(l.popup_confirm_logout) }}
    </DialogModal>
</template>

<style lang="scss" scoped>
#home-view {
    width: 100%;
    height: 100%;
    background-image: var(--back-ground-texture);
    color: var(--footer-text);
    background-size: cover;
}

.home-container {
    margin: auto;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
}

.home-header {
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    flex-shrink: 0;
    font-weight: bold;
}

.home-header-title {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding-top: 5rem;
}

.aire-logo {
    width: 25rem;
}

.image-logo {
    width: inherit;
}

.header-text {
    font-size: larger;
    text-align: center;
    color: var(--basic-text);
    margin-inline: 0.5rem;
    margin-block-start: 1.5rem;
}

.quick-nav {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: center;
    margin: 2rem 0;
    gap: 2rem;
    width: 100%;
}

.get-started {
    width: 216.32px;
    height: 55px;
    border-radius: 20px;

    font-size: var(--font-medium);
    box-shadow: 0px 1px var(--shadow-color);
    border: unset;
}

.home-footer {
    margin-top: 2rem;
    margin-bottom: 3rem;
    background-color: white;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.disclaimer {
    margin-inline: 3rem;
}

.chat-bot {
    position: relative;
    overflow: visible;
    width: 8rem;
    height: 8rem;
    margin: -6rem 0;
    right: 2rem;
    flex-shrink: 0;
    background-image: url(/src/assets/images/aire-bot.png);
    background-repeat: no-repeat;
    background-size: contain;
}

button.frontpage-button {
    border: none;
    background-color: transparent;
}

.frontpage-button:hover {
    color: var(--hover-text);
}

@media screen and ((max-aspect-ratio: 1/1) or (max-width: 920px)) {
    .chat-bot {
        padding: 2rem;
        width: 2.5rem;
        height: 2.5rem;
        right: 1rem;
    }

    .aire-logo {
        width: 16rem;
    }

    .disclaimer {
        margin-inline: 2rem;
    }
}

@media screen and ((max-aspect-ratio: 1/1) or (max-width: 576px)) {
    .home-header {
        background-size: cover;
        padding-top: 5rem;
    }

    .home-header-title {
        justify-content: flex-start;
        padding-top: 2rem;
        padding-bottom: 3rem;
    }

    .aire-logo {
        width: 10rem;
    }

    .get-started {
        width: 13rem;
        height: 3rem;
        border-radius: 1rem;

        font-size: var(--font-medium);
        box-shadow: 0px 1px var(--shadow-color);
        border: unset;
    }

    .quick-nav {
        margin: 0rem 0;
    }

    .home-footer {
        margin-top: 3rem;
        font-size: var(--font-small);
        text-align: center;
        margin-bottom: 2rem;
    }

    .chat-bot {
        display: none;
    }

    .frontpage-button {
        width: 15rem !important;
        height: 4rem !important;
    }
}
</style>
