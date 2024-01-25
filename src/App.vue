<script setup lang="ts">
import Footer from './components/Footer.vue'
import Spinner from './components/Spinner.vue';
import { AppState } from './main';
import BurgerMenu from './views/BurgerMenu.vue';

</script>

<template>
  <BurgerMenu></BurgerMenu>
  <div id="content-wrapper">
    <router-view v-if="AppState === 'loaded'"/>
    <div class="panel main-content" v-if="AppState === 'init'"><Spinner /></div>
    <div class="panel main-content" v-if="AppState === 'error'">{{ $t("error_generic") }}</div>
  </div>
 <Footer></Footer>
</template>

<style src="@/style/default.css" />
