<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps<{
    open: boolean
}>()

</script>

<template>
    <div class="menu-button" :class="{ 'menu-button-active': props.open }">
        <div type="button" class="button-graphics" title="Menu">
            <span class="button-bar button-bar--1"></span>
            <span class="button-bar button-bar--2"></span>
            <span class="button-bar button-bar--3"></span>
        </div>
    </div>
</template>

<style scoped>
.menu-button {
    position: absolute;

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    padding: 0.5rem;
    left: 1rem;
    top: 1rem;
    width: 3.5rem;
    height: 3.2rem;
    z-index: 10;

    background-color: var(--panel-background-color);
    border-radius: 1rem;
    border: 1px solid var(--border-color);
    box-shadow: 0 0 5px var(--shadow-color);

    transition: 
        border-color .25s, 
        background-color .25s, 
        box-shadow .25s;

    cursor: pointer;
}

.menu-button-active {
    background-color: transparent;
    border-color: transparent;
    box-shadow: none;
}

.button-graphics {
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
    background-color: var(--text-color);
    position: absolute;
    top: 50%;
    right: 6px;
    left: 6px;
    height: 3px;
    width: auto;
    margin-top: -1px;
    transition:
        transform .6s cubic-bezier(.165, .84, .44, 1),
        opacity .3s cubic-bezier(.165, .84, .44, 1),
        background-color .6s cubic-bezier(.165, .84, .44, 1);
}

.menu-button:hover .button-bar {
    background-color: var(--accent-primary-color);
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

.button-graphics:hover .button-bar--2 {
    transform: scaleX(1);
}

.no-touchevents .button-bar--2:hover {
    transform: scaleX(1);
}

.button-bar--3 {
    transform: translateY(6px);
    top: 60%;
}

.menu-button-active .button-graphics {
    transform: rotate(-180deg);
}

.menu-button-active .button-bar--1 {
    transform: rotate(45deg);
    top: 50%;
}

.menu-button-active .button-bar--2 {
    opacity: 0;
}

.menu-button-active .button-bar--3 {
    transform: rotate(-45deg);
    top: 50%;
}

@media screen and (max-width: 600px) {
    .menu-button {
        padding: 0.5rem;
        left: 0.5rem;
        top: 0.5rem;
        width: 2.2rem;
        height: 2rem;
        border: none;
        box-shadow: unset;
    }
}
</style>