<script setup lang="ts">
import { AireServices, AireUserPreferences } from 'aire';
import { reactive } from 'vue';
import useLogin from '@/context/login';
import Switch from '@/components/common/Switch.vue';
import Spinner from '@/components/common/Spinner.vue';

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
        <h3>Experiments</h3>
        <div class="experimental-item">
            <div class="experimental-item-toggle">
                <Switch class="experimental-item-toggle-switch" :is-on="state.overridePrompt" @change="toggleOverridePrefs" :colorized="true" />
                <span>Override chatbot system prompt</span>
            </div>
            <textarea v-model="state.prefs.experimental_custom_prompt" :readonly="!state.overridePrompt"></textarea>
            <p>Add <code>{user_summary}</code> into your prompt if you wish to inject a summary of your user profile.</p>
        </div>
        <template v-if="state.busy">
            <Spinner />
        </template>
        <template v-if="!state.busy">
            <button class="save-experiments-button" @click="onSave">Apply changes</button>
        </template>
    </div>
</template>

<style>
.profile-experiments {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.experimental-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    textarea {
        max-width: 80%;
        min-width: 80%;
        min-height: 5rem;
        align-self: center;
    }
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

.save-experiments-button {
    height: 4rem;
}
</style>