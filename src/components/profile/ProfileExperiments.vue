<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->

<script setup lang="ts">
import { AireServices, AireUserPreferences } from 'aire';
import { reactive } from 'vue';
import { l } from '@/locales';
import useLogin from '@/context/login';
import Switch from '@/components/common/Switch.vue';
import Spinner from '@/components/common/Spinner.vue';
import Tooltip from "@/components/common/Tooltip.vue";

const login = useLogin();

const state = reactive<{
    prefs: AireUserPreferences,
    overridePrompt: boolean,
    busy: boolean
}>({
    prefs: login.user?.preferences || {},
    overridePrompt: login.user?.preferences?.experimental_custom_prompt !== undefined,
    busy: false
});

const toggleOverridePrefs = () => {
    state.overridePrompt = !state.overridePrompt;
}

const onSave = () => {
    if (!login.user || !AireServices.ID)
        return;

    const profile = login.user;
    profile.preferences = {
        experimental_custom_prompt: state.overridePrompt
            ? state.prefs.experimental_custom_prompt : undefined
    }

    state.busy = true;
    AireServices.ID.saveProfileData(profile)
        .then((res) => {
            if (res.data?.preferences && login.user) {
                state.prefs = res.data.preferences;
                login.user.preferences = state.prefs;
            }
        })
        .finally(() => {
            state.busy = false
        })
}
</script>

<template>
    <div class="profile-experiments">
        <h2>{{ $t(l.profile_experiments_title) }}</h2>
        <div class="experimental-item">
            <div class="experimental-item-toggle">
                <Tooltip :text="$t(l.tooltip_override)" position="top" :useMaxContent="false" :adjustPosition="false">
                    <div>
                        <Switch input-id="experimental-prompt-toggle" class="experimental-item-toggle-switch" :is-on="state.overridePrompt"
                            @change="toggleOverridePrefs" :colorized="true"
                            @keydown.prevent.space.enter="toggleOverridePrefs" />
                    </div>
                </Tooltip>
                <label for="experimental-prompt-toggle">{{ $t(l.profile_experiments_text) }}</label>
            </div>
            <div class="experimental-prompt-wrapper">
                <label for="custom-prompt">{{ $t(l.profile_experiments_prompt) }}</label>
                <textarea id="custom-prompt" v-model="state.prefs.experimental_custom_prompt"
                    :readonly="!state.overridePrompt" aria-describedby="prompt-override-desc"></textarea>
            </div>
            <p id="prompt-override-desc">{{ $t(l.profile_experiments_add) }} <code>{user_summary}</code> {{
                $t(l.profile_experiments_description) }}</p>
        </div>
        <template v-if="state.busy">
            <Spinner />
        </template>
        <template v-if="!state.busy">
            <Tooltip :text="$t(l.tooltip_save)" position="top" :useMaxContent="false" :adjustPosition="true">
                <button class="btn" @click="onSave">{{ $t(l.profile_experiments_apply) }}</button>
            </Tooltip>
        </template>
    </div>
</template>

<style lang="scss" scoped>
.profile-experiments {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.experimental-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.experimental-item-toggle {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
}

.experimental-item-toggle-switch {
    width: 2rem;
}

.experimental-prompt-wrapper {
    margin-block-start: 0.5rem;
    display: flex;
    width: 100%;
    gap: 0.5rem;

    label {
        flex-basis: 10%;
        font-size: var(--font-medium);
    }

    textarea {
        min-height: 5rem;
        flex-grow: 1;
        resize: none;
    }
}

.save-experiments-button-wrapper {
    height: 4rem;
    display: flex;
    justify-content: center;
    align-items: center;
}

@media screen and ((max-aspect-ratio: 1/1) or (max-width: 920px)) {
    .experimental-prompt-wrapper>label {
        flex-basis: 20%;
    }
}

@media screen and (max-width: 576px) {
    .experimental-prompt-wrapper {
        flex-direction: column;
    }
}
</style>