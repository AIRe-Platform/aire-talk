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
        <label for="theme-switch" class="theme-switch-label">{{ $t(l.switch_color_mode) }}</label>
        <div id="theme-switch-info" hidden aria-hidden="true">
            {{ theme.style === 'theme-dark'
                ? $t(l.screen_recorder_theme_switch_dark)
                : $t(l.screen_recorder_theme_switch_light) }}
        </div>
        <Tooltip id="theme-tooltip" :text="$t(l.tooltip_menu_ui_mode)" position="top" :useMaxContent="false"
            :adjustPosition="true">
            <div class="theme-switch">
                <font-awesome-icon icon="fa-solid fa-sun" />
                <Switch input-id="theme-switch"
                    :is-on="theme.style === 'theme-dark'"
                    describedby="theme-switch-info"
                    @change="onSwitchTheme(theme.style !== 'theme-dark')" />
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