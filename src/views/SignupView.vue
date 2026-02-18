<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->


<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import { l } from '@/locales';
import { router } from '@/router';
import { AireStatus } from 'aire';
import useLogin from '@/context/login';
import Spinner from '@/components/common/Spinner.vue';
import TextButton from "@/components/common/TextButton.vue";
import { useRoute } from 'vue-router';
import usePlatform from '@/context/platform';

const state = reactive<{
    busy: boolean,
    invite: boolean,
    error?: string,
}>({
    busy: false,
    invite: false
});

const fields = reactive<{
    email: string,
    password: string,
    passwordConfirm: string
}>({
    email: "",
    password: "",
    passwordConfirm: ""
});

const route = useRoute();
const platform = usePlatform();
const login = useLogin();

const onSignup = (e: Event) => {
    const form = e.target as HTMLFormElement

    if (!form.checkValidity())
        return;

    if (fields.password !== fields.passwordConfirm) {
        state.error = l.error_signup_password_mismatch;
        return;
    }

    state.busy = true;
    state.error = undefined;

    const signup = async () => {
        if (state.invite)
            return await login.upgradeTrial(fields.password)
        else
            return await login.signup(fields.email, fields.password);
    }

    signup()
        .then(status => {
            if (status == AireStatus.Success) {
                if (state.invite) {
                    login.logout();
                }
                else {
                    router.push({ path: "/", query: { signup_success: "1" } });
                }
            }
            else if (status == AireStatus.BadRequest) {
                state.error = l.error_signup_bad_request;
            }
            else {
                state.error = l.error_signup_general;
            }
        })
        .finally(() => {
            state.busy = false;
        });
}

const goBack = () => {
    router.push("/");
}

onMounted(async () => {
    if (route.params.platform) {
        const plat = route.params.platform as string;
        await platform.switch(plat, false);
    }

    const upgradeAccount = login.session?.invite?.allow_upgrade ?? false;
    state.invite = upgradeAccount;

    if (login.user && !upgradeAccount) {
        goBack();
        return;
    }
})
</script>

<template>
    <div class="signup-view">
        <form class="form-content" @submit.prevent="onSignup">
            <h1>{{ $t(l.signup_form_title) }}</h1>
            <template v-if="!state.invite">
                <label for="signup-email" class="form-label">{{ $t(l.signup_label_email) }}</label>
                <input type="email" id="signup-email" required="true" autocomplete="email" v-model="fields.email"
                    :readonly="state.busy" />
            </template>
            <label for="signup-password" class="form-label">{{ $t(l.signup_label_password) }}</label>
            <input type="password" id="signup-password" required="true" autocomplete="off" v-model="fields.password"
                :readonly="state.busy" minlength="8" />
            <small id="password-instructions">{{ $t(l.signup_password_instructions) }}</small>
            <label for="signup-password-confirm" class="form-label">{{ $t(l.signup_label_confirm_password) }}</label>
            <input type="password" id="signup-password-confirm" required="true" autocomplete="off"
                v-model="fields.passwordConfirm" :readonly="state.busy" minlength="8" />
            <br />
            <small id="signup-failed-message" v-if="state.error">{{ $t(state.error) }}</small>
            <button class="btn" v-if="!state.busy" type="submit">{{ $t(l.signup_form_submit) }}</button>
            <div class="signup-busy" v-if="state.busy">
                <Spinner />
            </div>
            <TextButton v-if="!state.busy" v-on:click="goBack" class="go-back">{{ $t(l.button_back) }}</TextButton>
        </form>
    </div>
</template>

<style lang="scss" scoped>
.signup-view {
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

.signup-busy {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

#signup-failed-message {
    color: var(--error-color);
    white-space: pre-line;
}

.form-label {
    padding-top: 0.5rem;
}

input[type=submit] {
    margin: 1rem;
}

input[type=email],
input[type=password] {
    padding: 0.5rem;
    margin: 0.2rem 0;
}

.go-back {
    display: flex;
    align-items: center;
    padding: 1rem;
    margin-top: 1rem;
    justify-content: center;
    cursor: pointer;
}

@media screen and ((max-aspect-ratio: 1/1) or (max-width: 920px)) {
    .form-content {
        width: 70%;
        padding: 1rem 2rem;
    }
}
</style>
