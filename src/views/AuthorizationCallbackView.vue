<!-- 
    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at https://mozilla.org/MPL/2.0/.
-->

<script setup lang="ts">
import Panel from '@/components/common/Panel.vue';
import Spinner from '@/components/common/Spinner.vue';
import useLogin from '@/context/login';
import { l } from '@/locales';
import { onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const state = reactive<{
    busy: boolean,
    error?: string,
    error_message?: string
    show_details: boolean
}>({
    busy: false,
    show_details: false
})

const handleCallback = () => {
    const code_param = route.query.code?.toString();
    const state_param = route.query.state?.toString();
    if (code_param && state_param) {
        useLogin()
            .loginWithAuthenticationCode(code_param, state_param)
            .then(res => {
                if (res.ok) {
                    router.push("/home");
                }
                else {
                    state.error = res.error?.error;
                    state.error_message = res.error?.error_message;
                }
            })
    }
    else {
        state.error = route.query.error as string | undefined;
        state.error_message = route.query.error_message as string | undefined;
    }
}

const onBackToHome = () => {
    router.push("/");
}

const toggleDetails = () => {
    state.show_details = !state.show_details
}

onMounted(handleCallback);
</script>

<template>
    <div class="callback-view">
        <Spinner v-if="state.busy" />
        <Panel class="callback-error" v-if="state.error">
            <h1 class="callback-error-message">{{ $t(l.login_callback_failure) }}</h1>
            <div class="callback-error-details-button" :class="{ 'callback-error-details-open': state.show_details }" @click="toggleDetails">
                {{ $t(l.login_callback_error_description) }}
            </div>
            <div class="callback-error-description" :class="{ 'callback-error-description-open': state.show_details }">
                {{ state.error_message }} ({{ state.error }})
            </div>
            <button class="callback-error-button-back btn" @click="onBackToHome">{{ $t(l.login_callback_button) }}</button>
        </Panel>
    </div>
</template>

<style scoped>
.callback-view {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 32rem;
    margin: auto;
}

.callback-error {
    display: flex;
    flex-direction: column;
    padding: 1.6rem;
}

.callback-error-message {
    font-size: larger;
}

.callback-error-description {
    display: block;
    border-radius: 0.5rem;
    background-color: var(--panel-background-color);
    font-size: var(--font-small);
    height: 0;
    border: 0;
    opacity: 0;
    overflow: hidden;
    transition: all .2s;
}

.callback-error-description-open {
    display: block;    
    height: auto;
    padding: 1rem;
    border: 1px solid var(--border-color);
    opacity: 1;
}

.callback-error-details-button {
    display: flex;
    flex-direction: row;
    transition: all .2s;
    cursor: pointer;
    margin-top: 0.6rem;

    &:hover {
        color: var(--accent-primary-color);
        text-decoration: underline;
    }

    &::before {
        content: "";
        border-style: solid;
        position: relative;
        border-width: 0.33rem;
        margin-top: 0.1rem;
        margin-right: 0.33rem;
        height: 0px;
        width: 0px;
        border-color: transparent transparent transparent var(--text-color);
        transition: all .2s;
    }
}

.callback-error-details-open::before {
    transform: translateY(0.2rem) rotate(90deg) 
}

.callback-error-button-back {
    margin-top: 1rem;
}
</style>