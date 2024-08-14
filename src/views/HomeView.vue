<script setup lang="ts">
import { l } from '@/locales';
import { router } from '@/router';
import { onMounted, reactive } from 'vue';
import { getAllChats } from '@/helpers/chatUtils';
import useLogin from '@/context/login';
import useChat from '@/context/chat';

import DialogModal from "@/components/layout/DialogModal.vue";
import OnboardingTopics from '@/components/home/OnboardingTopics.vue';

const login = useLogin();
const chat = useChat();

const state = reactive<{
    showConfirmLogout: boolean,
    showLastChatButton: boolean,
}>({
    showConfirmLogout: false,
    showLastChatButton: false
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
    if (await chat.open(last))
        router.push("/chat");
}

const navigateTo = (path: string) => {
    router.push(path)
}

onMounted(async () => {
    const last = await getLastChatId();
    state.showLastChatButton = (last !== undefined);
})
</script>

<template>
    <OnboardingTopics />

    <div id="home-view">
        <div class="home-container">
            <div class="home-header">
                <div class="home-header-title">
                    <div class="aire-logo">
                        <img src="@/assets/images/aire-logo-letter.svg" alt="Logo" />
                    </div>
                    <p>{{ $t(l.start_first_paragraph) }}</p>
                </div>
            </div>
            <div class="quick-nav">
                <div class="icon frontpage-button" @click="newChat()">
                    {{ $t(l.home_start_new_chat) }}
                </div>
                <div class="icon frontpage-button" @click="openLastChat()" v-if="state.showLastChatButton">
                    {{ $t(l.home_continue_chat) }}
                </div>
                <div class="icon frontpage-button" @click="state.showConfirmLogout = !state.showConfirmLogout">
                    {{ $t(l.nav_logout) }}
                </div>
            </div>
            <div class="home-footer">
                <p class="disclaimer">{{ $t(l.start_footer) }}<br /><b>{{ $t(l.start_disclaimer) }}</b></p>
                <div class="chat-bot">
                </div>
            </div>
        </div>
    </div>
    <DialogModal :active="state.showConfirmLogout" :buttons="[
        { loc_key: l.button_accept },
        { loc_key: l.button_cancel },
    ]" @select="(i: number) => {
        if (i == 0) { onConfirmLogout() }
        else if (i == 1) { state.showConfirmLogout = false; }
    }">
        {{ $t(l.popup_confirm_logout) }}
    </DialogModal>
</template>

<style lang="scss" scoped>
#home-view {
    width: 100%;
    height: 100%;
    background-image: var(--back-ground-texture);
    color: var(--title-text);
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
    background-image: url("@/assets/images/aire-fp-papertexture.png");
    background-repeat: repeat-x;
    height: 420px;
    background-position: bottom;
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
}

.aire-logo {
    width: 20rem;
}

.quick-nav {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    margin: 2rem 0;
    gap: 2rem;
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
    margin-left: 1rem;
    margin-right: 3rem;
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

@media screen and ((max-aspect-ratio: 1/1) or (max-width: 920px)) {
    .home-header {
        height: 20rem;
    }

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
        margin-left: 1rem;
        margin-right: 1rem;
    }
}

@media screen and ((max-aspect-ratio: 1/1) or (max-width: 920px)) {
    .home-header {
        background-size: cover;
        padding-top: 5rem;
        height: 12rem;
    }

    .home-header-title {
        justify-content: flex-start;
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
        font-size: xx-small;
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
