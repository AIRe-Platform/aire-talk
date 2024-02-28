<script setup lang="ts">
import { AppState } from '@/main';
import FooterBar from '@/components/FooterBar.vue';
import NavMenu from '@/components/NavMenu.vue';
import ChatHistory from '@/components/chat/ChatHistory.vue';
import { UIPanels, UIState } from '@/context/ui';
import SettingsPanel from '@/components/SettingsPanel.vue';
import AppLoadingIndicator from '@/components/AppLoadingIndicator.vue';

setTimeout(() => {
    if(AppState.value === "init")
        location.reload()
}, 5000)

</script>

<template>
    <div id="main" v-if="AppState === 'loaded'">
        <NavMenu />
        <div id="content-wrapper">
            <RouterView />
            <div id="floating-panels" v-if="UIState.panels.size > 0">
                <ChatHistory v-if="UIState.panels.has(UIPanels.ChatHistory)" />
                <SettingsPanel v-if="UIState.panels.has(UIPanels.Settings)" />
            </div>
        </div>
    </div>
    <div class="main-content" v-if="AppState === 'init'">
        <AppLoadingIndicator />
    </div>
    <div class="main-content" v-if="AppState === 'error'">
        {{ $t("error_generic") }}
    </div>
    <FooterBar />
</template>

<style src="@/style/default.css" />
<style scoped>
#main {
    display: flex;
    flex-direction: row;
    overflow: hidden;
    height: 100%;
    max-height: 100%;
    background-color: var(--background-color);
}

#content-wrapper {
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    overflow: auto;
}

#floating-panels {
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

.main-content {
    display: flex;
    padding: 1rem;
    margin: auto;
}

@media screen and (max-width: 600px) {
    #content-wrapper {
        margin: 0.2rem;
        margin-top: 4rem;
    }

    #floating-panels {
        top: 4rem;
        bottom: 1rem;
        left: 0;
        right: 0;

        align-items: center;
        justify-content: center;
    }
}
</style>
