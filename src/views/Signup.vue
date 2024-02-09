<script setup lang="ts">
import { defineComponent, ref } from 'vue';
import Spinner from '@/components/Spinner.vue';
import { l } from '@/locales';
import { router } from '@/router';
import { signup } from '@/context/login';


const busy = ref(false);
const error = ref<string | null>(null);

const onSignup = (e: Event) => {
    e.preventDefault();

    if (busy.value) return;
    const email = document.getElementById("signup-email") as HTMLInputElement;
    const pw1 = document.getElementById("signup-password") as HTMLInputElement;
    const pw2 = document.getElementById("signup-password-confirm") as HTMLInputElement;

    if (email.form?.checkValidity() !== true) {
        return;
    }

    if (pw1.value !== pw2.value) {
        error.value = l.error_signup_password_mismatch;
        return;
    }

    busy.value = true;
    signup(email.value, pw1.value)
        .then((status) => {
            if (status === 204) {
                router.push("/")
            }
            else if (status === 400) {
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

defineComponent({ name: "SignupView" })
</script>

<template>
    <div class="signup-view">
        <form class="form-content" @submit.prevent v-if="busy === false">
            <h2>{{ $t(l.signup_form_title) }}</h2>
            <label for="signup-email" class="form-label">{{ $t(l.signup_label_email) }}</label>
            <input type="email" id="signup-email" required="true" autocomplete="email" />
            <label for="signup-password" class="form-label">{{ $t(l.signup_label_password) }}</label>
            <input type="password" id="signup-password" required="true" autocomplete="off" />
            <label for="signup-password-confirm" class="form-label">{{ $t(l.signup_label_confirm_password) }}</label>
            <input type="password" id="signup-password-confirm" required="true" autocomplete="off" />
            <br />
            <small id="signup-failed-message" v-if="error != null">{{ $t(error) }}</small>
            <input type="submit" :value="$t(l.signup_form_submit)" @click="onSignup" />
        </form>
        <div class="busy-panel" v-if="busy">
            <Spinner />
        </div>
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
    width: 60%;
    box-shadow: 0 0 5px var(--shadow-color);
    background-color: var(--panel-background-color);
    border-radius: 1rem;
    padding: 2rem 3rem;
    flex-grow: 1;
}

.busy-panel {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50%;
    box-shadow: 0 0 5px var(--shadow-color);
    background-color: var(--panel-background-color);
    border-radius: 1rem;
    padding: 2rem 3rem;
    flex-grow: 1;
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

@media screen and (max-width: 600px) {
    .form-content {
        width: 70%;
        padding: 1rem 2rem;
    }
}
</style>
