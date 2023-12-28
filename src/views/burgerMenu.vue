<script setup lang="ts">
    import { defineComponent } from 'vue';
    import { l } from '@/locales';
    defineComponent({ name: "BurgerMenuView" })
    import { BurgerMenuState } from '@/context/burgerMenuState';
    import { RouterLink } from 'vue-router';


/**
 * Toogle the burger menu and send it to main view.
 */
const togleMenu = (e: Event) => {
    e.preventDefault();
    BurgerMenuState.isBurgerMenuOpen = !(BurgerMenuState.isBurgerMenuOpen);
};
</script>

<template>
    <div  class="burger-menu-menu">
        <div id="burger" :class="{
            'active': BurgerMenuState.isBurgerMenuOpen
            }" @click="togleMenu">
            <button type="button" class="burger-button" title="Menu">
                <span class="burger-bar burger-bar--1"></span>
                <span class="burger-bar burger-bar--2"></span>
                <span class="burger-bar burger-bar--3"></span>
            </button>
        </div>
        <div id="navbarNav" v-show="BurgerMenuState.isBurgerMenuOpen">
            <div class="nav-logo">
                <img src="../../public/logos/AIRE-Platform-Logo-400x400.png" alt="Logo">
            </div>
            <div class="nav-menu-list">
                <div class="nav-item active">
                    <a class="nav-link" href="#">{{ $t(l.burger_menu_chat_log_history) }}</a>
                </div>
                <div class="nav-item">
                    <a class="nav-link" href="#">{{ $t(l.burger_menu_content_catalogue) }}</a>
                </div>
                <div class="nav-item button-nav-item">
                    <RouterLink class="nav-link" to="/profile">{{ $t(l.burger_menu_current_user) }}</RouterLink>
                </div>
                <div class="nav-item">
                    <a class="nav-link" href="#">{{ $t(l.burger_menu_settings) }}</a>
                </div>
            </div>
        </div> 
    </div>   
</template>

<style scoped lang="scss">
    $burger-color: var(--text-color);
    $primary: var(--background-color);

    .burger-menu-menu{
        background-color: var(--panel-background-color);
        position: absolute;
        padding: 1rem;
        margin-top: 2rem;
        margin-bottom: 2rem;
        width: auto;
        border-radius: 10px;
    }

    .nav-logo{
        width: 5rem;
        height: 5rem;
        margin-left: 2.5rem;
    }
    .nav-menu-list{
        margin-top: 2rem;
    }
    .nav-item{
        padding: 1rem;
        display: flex;
        justify-content: center;
    }
    .button-nav-item{
        margin-top: 10rem;
    }

    .nav-logo{
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

/*     @media screen and (max-width: 991px) {
        #burger {
            display: block;
        }
    }

    @media screen and (min-width: 990px) {
        #burger {
            display: none;
        }
    } */
</style>@/context/burgerMenu