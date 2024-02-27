<script setup lang="ts">
import { defineComponent } from "vue";
defineComponent({ name: "AppLoadingIndicatorComponent " });
</script>

<template>
    <div class="app-loading-indicator">
        <img
            class="chatbot-icon"
            src="@/assets/images/AIRe_loading-animaatio-test2_forever_750x750.gif"
            alt="Logo"
        />
    </div>
</template>

<style>
.app-loading-indicator {
    width: 56px;
    min-height: 1rem;
    transform: scale(0.15);
    margin: auto;
}
</style>
