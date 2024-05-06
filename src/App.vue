<script setup lang="ts">
import { AppState } from '@/main';
import FooterBar from '@/components/FooterBar.vue';
import NavMenu from '@/components/NavMenu.vue';
import ChatHistory from '@/components/chat/ChatHistory.vue';
import { UIPanels, UIState, UISettings } from '@/context/ui';
import SettingsPanel from '@/components/SettingsPanel.vue';
import AppLoadingIndicator from '@/components/AppLoadingIndicator.vue';

setTimeout(() => {
    if (AppState.value === "init")
        location.reload()
}, 5000)

</script>

<template>
    <div id="main" v-if="AppState === 'loaded'" tabindex="1"
        :class="{ 'mobile-screen': UISettings.screenSize == 'mobile-screen' }">
        <NavMenu />
        <div class="main-content">
            <RouterView />
            <div class="main-panels" :class="{ 'main-panels-mobile-screen': UISettings.screenSize == 'mobile-screen' }"
                v-if="UIState.panels.size > 0">
                <ChatHistory v-if="UIState.panels.has(UIPanels.ChatHistory)" />
                <SettingsPanel v-if="UIState.panels.has(UIPanels.Settings)" />
            </div>
        </div>
    </div>
    <div class="main-splash" v-if="AppState === 'init'">
        <AppLoadingIndicator />
    </div>
    <div class="main-error" v-if="AppState === 'error'">
        {{ $t("error_generic") }}
    </div>
    <FooterBar />
</template>

<style src="@/style/default.css" />
<style src="@/style/icons.css" />
<style scoped>
#main {
    display: flex;
    flex-direction: row;
    overflow: hidden;
    height: 100%;
    max-height: 100%;
}

.main-content {
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    overflow: auto;
    background-color: var(--background-color);
    background-image: var(--back-ground-texture);
    background-size: cover;
}

.main-panels {
    position: absolute;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: flex-start;
    overflow: hidden;
    padding: 1rem;
    top: 0;
    bottom: 0;
}

.main-splash,
.main-error {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    overflow: auto;
    align-items: stretch;
    justify-content: center;
    text-align: center;
}

.mobile-screen {
    height: 74% !important;
    width: 28%;
}

.main-panels-mobile-screen {
    bottom: unset;
}



@media screen and ((max-aspect-ratio: 1/1) or (max-width: 920px)) {
    .main-content {
        font-size: small;
    }


    .main-panels {
        top: -4rem;
        bottom: 0rem;
        left: 0;
        right: 0;

        align-items: center;
        justify-content: center;
    }
}
</style>
