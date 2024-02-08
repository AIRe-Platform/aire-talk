<script setup lang="ts">
import { AppState } from './main';
import FooterBar from './components/FooterBar.vue';
import Spinner from './components/Spinner.vue';
import NavMenu from './components/NavMenu.vue';
</script>

<template>
    <NavMenu />
    <div id="content-wrapper">
        <RouterView v-if="AppState === 'loaded'" />
        <div class="panel main-content" v-if="AppState === 'init'">
            <Spinner />
        </div>
        <div class="panel main-content" v-if="AppState === 'error'">{{ $t("error_generic") }}</div>
    </div>
    <FooterBar />
</template>

<style src="@/style/default.css" />
<style scoped>
#content-wrapper {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    overflow: auto;
    margin: 0 8rem;
}

.main-content {
    display: flex;
    padding: 1rem;
    margin: auto;
}
</style>
