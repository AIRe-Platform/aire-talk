<script setup lang="ts">
import NavBar from './components/NavBar.vue'
import Footer from './components/Footer.vue'
import { State } from './services/aire';
</script>

<template>
  <NavBar />
  <div id="content-wrapper">
    <router-view v-if="State.status === 'ready'"/>
    <div class="panel main-content" v-if="State.status === 'init'">...</div>
    <div class="panel main-content" v-if="State.status === 'error'">{{ $t("error_generic") }}</div>
  </div>
  <Footer></Footer>
</template>

<style src="@/style/default.css" />
