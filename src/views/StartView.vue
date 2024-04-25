<script setup lang="ts">
import { l } from '@/locales';
import { router } from '@/router';

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
                <h1>{{ $t(l.start_greeting) }}</h1>
                <p>{{ $t(l.start_first_paragraph) }}</p>
                <svg class="line">
                    <line x1="00" y1="00" x2="350" y2="00"
                        style="stroke: #A0BCB8; stroke-width: 4px; stroke-dasharray: 2,15;" />
                </svg>
                <p>{{ $t(l.start_second_paragraph) }}</p>
            </div>
            <div class="quick-nav">
                <button class="get-started" @click="navigateTo('/login')">
                    {{ $t(l.nav_login) }}
                </button>
                <button class="get-started" @click="navigateTo('/signup')">
                    {{ $t(l.nav_signup) }}
                </button>
            </div>
            <div class="start-footer">
                <p>{{ $t(l.start_footer) }}</p>
            </div>
        </div>

    </div>
</template>

<style scoped>
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
    padding: 6rem;
    margin-top: 5rem;
    margin-bottom: 5rem;
    overflow: hidden;
    background-image: url(/src/assets/images/aire-bot.png);
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
}

.line {
    height: 1rem;
    padding: 1rem;
}

.quick-nav {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    margin: 1rem 0px -5rem 0rem;
    gap: 2rem;
}

.get-started {
    width: 216.32px;
    height: 55px;
    border-radius: 20px;
    opacity: 0px;
    background: var(--button-gradient-color);
    font-size: 1rem;
    color: var(--button-text);
}

.start-footer {
    display: flex;
    padding: 0rem 3rem;
    margin-top: 10rem;
    text-align: center;
}
</style>
