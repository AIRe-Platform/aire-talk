<script setup lang="ts">
import { reactive, ref } from 'vue';
import Spinner from '@/components/Spinner.vue';
import { l } from '@/locales';
import { router } from '@/router';
import { signup } from '@/context/login';
import { AireStatus } from 'aire';

const busy = ref(false);
const error = ref<string>();
const fields = reactive<{
    email?: string,
    password?: string,
    passwordConfirm?: string
}>({});

const onSignup = (e: Event) => {
    const form = e.target as HTMLFormElement

    if (!form.checkValidity())
        return;

    if (fields.password !== fields.passwordConfirm) {
        error.value = l.error_signup_password_mismatch;
        return;
    }

    busy.value = true;
    signup(fields.email!, fields.password!)
        .then((status) => {
            if (status == AireStatus.Success) {
                router.replace("/")
            }
            else if (status == AireStatus.BadRequest) {
                error.value = l.error_signup_bad_request;
            }
            else {
                error.value = l.error_signup_general;
            }
        })
        .finally(() => {
            busy.value = false;
        })
}
</script>

<template>
    <div class="signup-view">
        <form class="form-content" @submit.prevent="onSignup">
            <h2>{{ $t(l.signup_form_title) }}</h2>
            <label for="signup-email" class="form-label">{{ $t(l.signup_label_email) }}</label>
            <input type="email" id="signup-email" required="true" autocomplete="email" v-model="fields.email"
                :readonly="busy" />
            <label for="signup-password" class="form-label">{{ $t(l.signup_label_password) }}</label>
            <input type="password" id="signup-password" required="true" autocomplete="off" v-model="fields.password"
                :readonly="busy" />
            <label for="signup-password-confirm" class="form-label">{{ $t(l.signup_label_confirm_password) }}</label>
            <input type="password" id="signup-password-confirm" required="true" autocomplete="off"
                v-model="fields.passwordConfirm" :readonly="busy" />
            <br />
            <small id="signup-failed-message" v-if="error != null">{{ $t(error) }}</small>
            <input type="submit" :value="$t(l.signup_form_submit)" v-if="!busy" />
            <div class="signup-busy" v-if="busy">
                <Spinner />
            </div>
        </form>
    </div>
</template>

<style scoped>
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

@media screen and ((max-aspect-ratio: 1/1) or (max-width: 920px)) {
    .form-content {
        width: 70%;
        padding: 1rem 2rem;
    }
}
</style>
