<script setup lang="ts">
import burgerMenu from './burgerMenu.vue';
import { BurgerMenuState } from '@/context/burgerMenuState';
import { l } from '@/locales';
import { defineComponent } from 'vue';
defineComponent({ name: "HomeView" });

</script>

<template>
    <burger-menu></burger-menu>
    <div id="home-view" v-bind:class = "( BurgerMenuState.isBurgerMenuOpen )?'add-opacity':'no-opacity'">
        <router-link to="/chat" id="chat-link">
            <div id="chat-link-btn" class="panel">
                {{ $t("chat_link_button_label") }}
            </div>
        </router-link>
        <router-link to="/landing" id="">
            <div id="chat-link-btn" class="panel">
                {{ $t(l.home_start_landing_button) }}
                
            </div>
        </router-link>
        <router-link to="/checkBox" id="">
            <div id="chat-link-btn" class="panel">
                {{ $t(l.home_checkbox_button) }}
                
            </div>
        </router-link>
    </div>
</template>

<style scoped>
#home-view {
    padding: 1rem;
    margin: auto;
}

#chat-link-btn {
    padding: 2rem;
}

</style>
@/context/burgerMenu