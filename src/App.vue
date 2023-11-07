<script lang="ts">
import { defineComponent } from 'vue';
import NavBar from './components/NavBar.vue'
import Footer from './components/Footer.vue'
import { theme } from '@/themes'

import(`@/themes/styles/${theme.style}.css`);

export default defineComponent({
  name: 'App',
  components: {
    NavBar,
    Footer
  }
})
</script>

<template>
  <NavBar />
  <div id="content-wrapper">
    <router-view />
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
</style>
