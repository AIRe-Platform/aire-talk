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

<style>
:root.theme-default
{
  --background-color: #ffffff;
  --text-color: #2c3e50;
  --accent-primary-color: rgb(255, 65, 170);
  --accent-secondary-color: rgb(62, 147, 251);
  --shadow-color: gray;
  --border-color: lightgray;
  --font-family: sans-serif;
  --panel-background-color: rgb(248, 248, 248);
  --error-color: rgb(255, 120, 120);
  --chat-bubble-background-color: var(--background-color);
}

:root.theme-dark
{
  --background-color: #4a4a4a;
  --text-color: #dedede;
  --accent-primary-color: rgb(255, 65, 170);
  --accent-secondary-color: rgb(62, 147, 251);
  --shadow-color: gray;
  --border-color: darkgray;
  --font-family: sans-serif;
  --panel-background-color: rgb(53, 53, 53);
  --error-color: rgb(255, 120, 120);
  --chat-bubble-background-color: var(--background-color);
}

body {
  display: flex;
  flex-direction: column;
  margin: 0;
  height: 100vh;
}

a {
  text-decoration: none;
  color: var(--text-color);
  transition: color 0.5s;

  &:hover {
    color: var(--accent-primary-color);
  }
}

input[type=text],
input[type=password],
input[type=email],
select {
  color: var(--text-color);
  padding: 0.2rem 0.6rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
  background-color: var(--background-color);
  transition: all 0.1s;

  &:hover, &:focus {
    border-color: var(--accent-primary-color);
    box-shadow: 0 0 5px var(--accent-primary-color);
    outline: none;
  }
}

input[type=submit],
button {
  color: var(--text-color);
  background-color: var(--background-color);
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
  transition: all 0.1s;

  &:hover {
    background-color: var(--accent-primary-color);
    border-color: transparent;
    color: var(--background-color);
    box-shadow: 0 0 5px var(--accent-primary-color);
  }

  &:active {
    color: var(--text-color);
  }
}

#app {
  color: var(--text-color);
  background-color: var(--background-color);
  font-family: var(--font-family);
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
    display: flex;
    padding: 1rem;
    margin: auto;
}
</style>
