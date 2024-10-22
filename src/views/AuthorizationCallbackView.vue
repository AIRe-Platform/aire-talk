<!-- 
    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at https://mozilla.org/MPL/2.0/.
-->

<script setup lang="ts">
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
}>({
    busy: false
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

onMounted(handleCallback);
</script>

<template>
    <div class="callback-view">
        <Spinner v-if="state.busy" />
        <div class="callback-error" v-if="state.error">
            <div class="callback-error-message">{{ $t(l.login_callback_failure) }}</div>
            <div class="callback-error-description">
                <code>
                    {{ $t(l.login_callback_error_description) }}<br />
                    {{ state.error }}<br />
                    {{ state.error_message }}
                </code>
            </div>
            <button @click="onBackToHome">{{ $t(l.login_callback_button) }}</button>
        </div>
    </div>
</template>

<style scoped>
.callback-view {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
    width: 32rem;
    margin: auto;
}

.callback-error {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.callback-error-message {
    font-size: larger;
}

.callback-error-description {
    padding: 1rem;
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    background-color: var(--panel-background-color);
    font-size: var(--font-small);
}
</style>