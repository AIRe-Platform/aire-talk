<!--
    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at https://mozilla.org/MPL/2.0/.
-->

<script setup lang="ts">
import Switch from '../common/Switch.vue';
import { l } from '@/locales';
import Tooltip from '../common/Tooltip.vue';
import { UIState } from '@/context/ui';

const showTokens = UIState.showChatTokens();

function toggleShowTokens() {
    UIState.setChatTokensVisible(!showTokens.value);
}
</script>
<template>
    <div>
        <h2>{{ $t(l.profile_chat_history_tokens_heading) }}</h2>
        <div class="token-switch-wrapper">
            <Tooltip :text="$t(l.tooltip_tokens)" position="top">
                <Switch input-id="chat-history-token-toggle"
                    :is-on="showTokens"
                    @change="toggleShowTokens"
                    :colorized="true"
                    class="token-switch" />
            </Tooltip>
            <label for="chat-history-token-toggle">{{ $t(l.profile_chat_history_tokens_label) }}</label>
        </div>
    </div>
</template>
<style lang="scss" scoped>
.token-switch-wrapper {
    display: flex;
    align-items: center;

    & .token-switch {
        width: 2rem;
        flex-grow: 0;
    }
}
</style>
