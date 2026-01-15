<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->


<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { l } from '@/locales';
import useLogin from '@/context/login';
import Spinner from '@/components/common/Spinner.vue';
import { hideSpinner, showSpinner, SpinnerId } from '@/helpers/spinnerUtils';
import { useRoute } from 'vue-router';
import usePlatform from '@/context/platform';

const state = reactive<{
    busy: boolean,
    error: boolean,
    username?: string,
    password?: string
}>({
    busy: true,
    error: false
});

const route = useRoute();
const platform = usePlatform();

onMounted(async () => {
    showSpinner(SpinnerId.LoginView);

    if (route.params.platform) {
        const plat = route.params.platform as string;
        if (plat !== platform.current())
            return await platform.switch(plat);
    }

    useLogin()
        .redirectToLogin()
        .then(ok => { state.error = !ok; })
        .finally(() => { state.busy = false; hideSpinner(); });
})
</script>

<template>
    <div class="login-view">
        <template v-if="state.busy">
            <Spinner :id="SpinnerId.LoginView" />
            <h1 class="login-message">{{ $t(l.login_redirect) }}</h1>
        </template>
        <div class="login-error" v-if="state.error">
            {{ $t(l.login_failure) }}
        </div>
    </div>
</template>

<style lang="scss" scoped>
.login-view {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    max-width: 42rem;
    margin: auto;
}

.form-content {
    display: flex;
    flex-direction: column;
    width: 50%;
    box-shadow: 0 0 5px var(--shadow-color);
    background-color: var(--panel-background-color);
    border-radius: 1rem;
    padding: 2rem 3rem;
    flex-grow: 1;
}

.login-busy {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.login-recovery-link {
    font-size: var(--font-small);
    align-self: center;
    padding: 0.5rem;
    color: var(--link-color);
    text-decoration: underline;
}

#login-failed-message {
    color: var(--error-color);
    white-space: pre-line;
}

.form-label {
    padding-top: 0.5rem;
}

input[type=submit] {
    margin: 1rem;
}

input[type=text],
input[type=password] {
    padding: 0.5rem;
    margin: 0.2rem 0;
}

@media screen and ((max-aspect-ratio: 1/1) or (max-width: 920px)) {
    .form-content {
        width: 70%;
        padding: 1rem 2rem;
    }
}

.language-selector {
    padding-top: 3rem;
    padding-right: 9rem;
}

@media screen and ((max-aspect-ratio: 1/1) or (max-width: 920px)) {
    .language-selector {
        padding-top: 3rem;
        padding-right: 4rem;
    }
}
</style>
