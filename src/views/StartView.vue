<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->


<script setup lang="ts">
import { l } from '@/locales';
import { router } from '@/router';
import Separator from "@/components/common/Separator.vue";
import LanguageSelector from '@/components/settings/LanguageSelector.vue';

const navigateTo = (path: string) => {
    router.push(path)
}

</script>

<template>
    <div id="start-view">
        <div class="start-container">
            <div class="greeting">
                <img src="@/assets/images/aire-bot.png" alt="AIRe chat bot logo" class="chat-bot">
                <h1>{{ $t('start_greeting') }}</h1>
                <p>{{ $t(l.start_first_paragraph) }}</p>
                <Separator />
                <p>{{ $t(l.start_second_paragraph) }}</p>
            </div>
            <div class="quick-nav">
                <a class="icon frontpage-button" tabindex="0" role="link"
                    @keydown.prevent.space.enter="navigateTo('/login')" @click.prevent="navigateTo('/login')"
                    href="/login">
                    {{ $t(l.nav_login) }}
                </a>
                <a class="icon frontpage-button" tabindex="0" role="link"
                    @keydown.prevent.space.enter="navigateTo('/signup')" @click.prevent="navigateTo('/signup')"
                    href="/signup">
                    {{ $t(l.nav_signup) }}
                </a>
                <LanguageSelector />
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
    display: grid;
    overflow: auto;
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

    &>* {
        margin-inline: 0.5rem;
    }
}

.frontpage-button:hover {
    color: var(--hover-text);
}

.chat-bot {
    aspect-ratio: 1;
    height: 9rem;
    margin-block: 4rem;
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
    align-self: stretch;
    margin-block: 1rem;
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
    text-align: center;
    font-size: var(--font-small);
    margin-inline: 0.5rem;
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
        height: 8rem;
        margin-top: 3rem;
        margin-bottom: 2rem;
    }

    .start-footer {
        padding: 0rem 2rem;
        font-size: var(--font-small);
    }

    .frontpage-button {
        width: 15rem !important;
        height: 4rem !important;
    }
}
</style>
