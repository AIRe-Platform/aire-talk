<script setup lang="ts">
import NavBar from './components/NavBar.vue'
import Footer from './components/Footer.vue'
import Spinner from './components/Spinner.vue';
import { AppState } from './main';
</script>

<template>
  <NavBar />
  <div id="content-wrapper">
    <router-view v-if="AppState === 'loaded'"/>
    <div class="panel main-content" v-if="AppState === 'init'"><Spinner /></div>
    <div class="panel main-content" v-if="AppState === 'error'">{{ $t("error_generic") }}</div>
  </div>
  <Footer></Footer>
</template>

<style src="@/style/default.css" />
