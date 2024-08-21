<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->


<script setup lang="ts">
import { l } from '@/locales';
import { router } from '@/router';
import Separator from "@/components/common/Separator.vue";
import { onMounted } from 'vue';

const navigateTo = (path: string) => {
    router.push(path)
}

</script>

<template>
    <div id="start-view">
        <div class="start-container">
            <div class="greeting">
                <div class="chat-bot">
                </div>
                <h1>{{ $t('start_greeting') }}</h1>
                <p>{{ $t(l.start_first_paragraph) }}</p>
                <Separator />
                <p>{{ $t(l.start_second_paragraph) }}</p>
            </div>
            <div class="quick-nav">
                <div class="icon frontpage-button" @click="navigateTo('/login')">
                    {{ $t(l.nav_login) }}
                </div>
                <div class="icon frontpage-button" @click="navigateTo('/signup')">
                    {{ $t(l.nav_signup) }}
                </div>
            </div>
            <div class="start-footer">
                <p>{{ $t(l.start_footer) }}<br /><b>{{ $t(l.start_disclaimer) }}</b></p>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
#start-view {
    width: 100%;
    height: 100%;
    background-image: url("@/assets/images/aire-bg-texture-3.png");

}

.start-container {
    margin: auto;
    width: 33%;
    height: 100%;
    background-color: #E3FFFA;
    border-left: 2px solid #A0BCB8;
    border-right: 2px solid #A0BCB8;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: black;
    justify-content: space-around;
}

.greeting {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-weight: bold;
}

.chat-bot {
    padding: 4.5rem;
    margin-top: 4rem;
    margin-bottom: 4rem;
    overflow: hidden;
    background-image: url(/src/assets/images/aire-bot.png);
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
}

.line {
    height: 1rem;
    padding: 1rem;
    stroke: var(--dividers);
    stroke-width: 4px;
    stroke-dasharray: 2, 15;
}

.quick-nav {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    margin: 1rem 0px -5rem 0rem;
    gap: 2rem;
    align-items: center;
}

.get-started {
    width: 15rem;
    height: 3rem;
    border-radius: 20px;
    background: var(--button-gradient-color);
    font-size: var(--font-medium);
    color: var(--button-text);
}

.start-footer {
    display: flex;
    padding: 0rem 3rem;
    margin-top: 8rem;
    text-align: center;
    font-size: var(--font-small);
}

@media screen and ((max-aspect-ratio: 1/1) or (max-width: 920px)) {

    #start-view {
        background-size: cover;
    }

    .start-container {
        font-size: var(--font-small);
        width: 100%;
        height: 100%;
        background-color: unset;
        border-left: unset;
        border-right: unset;
    }

    .chat-bot {
        padding: 4rem;
        margin-top: 3rem;
        margin-bottom: 2rem;
    }

    .start-footer {
        padding: 0rem 2rem;
        margin-top: 7rem;
        font-size: xx-small;
    }

    .frontpage-button {
        width: 15rem !important;
        height: 4rem !important;
    }
}
</style>
