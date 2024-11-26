<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->

<script setup lang="ts">
import useTheme from "@/context/theme";
import Switch from "@/components/common/Switch.vue";
import { l } from "@/locales";
import Tooltip from "@/components/common/Tooltip.vue";

const theme = useTheme();

const onSwitchTheme = (dark: boolean) => {
    theme.apply(dark ? "theme-dark" : 'theme-default');
}
</script>
<template>
    <div class="theme-container">
        <p class="theme-switch-label">{{ $t(l.switch_color_mode) }}</p>
        <Tooltip id="theme-tooltip" :text="$t(l.tooltip_menu_ui_mode)" position="top" :useMaxContent="false"
            :adjustPosition="true">
            <div class="theme-switch" role="switch" :aria-checked="theme.style === 'theme-dark'"
                :aria-label="`Switch between light or dark User Interface mode. Current mode is ${theme.style === 'theme-dark' ? 'dark mode' : 'light mode'}. Switch to ${theme.style !== 'theme-dark' ? 'dark mode' : 'light mode'}`"
                tabindex="0" @keydown.prevent.space.enter="onSwitchTheme(theme.style !== 'theme-dark')"
                @click="onSwitchTheme(theme.style !== 'theme-dark')">
                <font-awesome-icon icon="fa-solid fa-sun" />
                <Switch :is-on="theme.style === 'theme-dark'" />
                <font-awesome-icon icon="fa-solid fa-moon" />
            </div>
        </Tooltip>
    </div>
</template>



<style lang="scss" scoped>
.switch {
    width: 10rem;
}

.theme-container {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.theme-switch-label {
    margin: 0;
}

.theme-switch {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    color: var(--settings-panel-theme-color);
    width: 100%;
}
</style>