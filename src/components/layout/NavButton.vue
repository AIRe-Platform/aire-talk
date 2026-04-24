<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->

<script setup lang="ts">
import { l } from '@/locales';
import Tooltip from "@/components/common/Tooltip.vue";

const props = defineProps<{
    open: boolean
}>()
</script>

<template>
    <button type="button" class="nav-button" :class="{ 'nav-button-active': props.open }" :aria-expanded="props.open"
        aria-haspopup="menu" :aria-label=$t(l.screen_recorder_main_navigation_menu)>
        <div>
            <Tooltip :text="$t(l.nav_main_menu)" position="right">
                <div class="nav-button-graphics">
                    <span class="button-bar button-bar--1"></span>
                    <span class="button-bar button-bar--2"></span>
                    <span class="button-bar button-bar--3"></span>
                </div>
            </Tooltip>
        </div>
    </button>
</template>

<style lang="scss" scoped>
.nav-button {
    position: absolute;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    left: 1rem;
    top: 1rem;
    width: 3.5rem;
    height: 3.2rem;
    z-index: 10;
    background: linear-gradient(#2374AB, #176087);
    border-radius: 1rem;
    border: 1px solid var(--border-color);
    box-shadow: 0 0 5px var(--shadow-color);
    transition:
        border-color .25s,
        background-color .25s,
        box-shadow .25s;
    cursor: pointer;
}

.nav-button-active {
    background-color: transparent;
    border-color: transparent;
    box-shadow: none;
}

.nav-button-graphics {
    position: relative;
    width: 40px;
    height: 30px;
    display: block;
    z-index: 99;
    border: 0;
    border-radius: 0;
    background-color: transparent;
    pointer-events: all;
    transition: transform .6s cubic-bezier(.165, .84, .44, 1);
    cursor: pointer;
}

.button-bar {
    background-color: white;
    position: absolute;
    top: 50%;
    right: 6px;
    left: 6px;
    height: 4px;
    width: auto;
    margin-top: -1px;
    transition:
        transform .6s cubic-bezier(.165, .84, .44, 1),
        opacity .3s cubic-bezier(.165, .84, .44, 1),
        background-color .6s cubic-bezier(.165, .84, .44, 1);
}

.nav-button:hover .button-bar {
    background-color: var(--hover-text);
}

.button-bar--1 {
    -webkit-transform: translateY(-6px);
    transform: translateY(-6px);
    top: 40%;
}

.button-bar--2 {
    transform-origin: 100% 50%;
    transform: scaleX(1);
}

.nav-button-graphics:hover .button-bar--2 {
    transform: scaleX(1);
}

.no-touchevents .button-bar--2:hover {
    transform: scaleX(1);
}

.button-bar--3 {
    transform: translateY(6px);
    top: 60%;
}

.nav-button-active .button-graphics {
    transform: rotate(-180deg);
}

.nav-button-active .button-bar--1 {
    transform: rotate(45deg);
    top: 50%;
}

.nav-button-active .button-bar--2 {
    opacity: 0;
}

.nav-button-active .button-bar--3 {
    transform: rotate(-45deg);
    top: 50%;
}

.tooltip {
    display: flex;
}

@media screen and ((max-aspect-ratio: 1/1) or (max-width: 920px)) {
    .nav-button {
        padding: 1.5rem;
        left: 0.5rem;
        top: 0.5rem;
        width: 2.2rem;
        height: 2rem;
        border: none;
        box-shadow: unset;
    }
}
</style>