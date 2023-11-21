<script setup lang="ts">
import NavBar from './components/NavBar.vue'
import Footer from './components/Footer.vue'
import { theme } from '@/themes'
import { State } from './services/aire';

import(`@/themes/styles/${theme.style}.css`);
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

<style>
body {
  display: flex;
  flex-direction: column;
  margin: 0;
  height: 100vh;
}

#app {
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  height: 100%;
}

#content-wrapper {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  overflow: auto;
}

.main-content {
    padding: 1rem;
    margin: auto;
}
</style>
