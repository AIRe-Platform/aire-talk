<script setup lang="ts">
import { Login } from '@/context/login';
import { router } from '@/router';
import { Services } from '@/services/aire';
import { defineComponent, ref } from 'vue';

const busy = ref(false);
const loginError = ref(false);

const onLogin = (e: Event) => {
    e.preventDefault();

    if(busy.value)
        return false;
    busy.value = true;

    if(Services.ID)
    {
        console.debug("Logging in...");

        const email = document.getElementById("login-email") as HTMLInputElement;
        const pw = document.getElementById("login-password") as HTMLInputElement;

        Services.ID.login(email.value, pw.value)
        .then((result) => {
            loginError.value = !result;
            Login.logged_in = result;
            if(result)
                router.push("/");
        })
        .catch((reason) => {
            console.error(reason);
            loginError.value = true;
        })
        .finally(() => {
            busy.value = false;
        })
    }
    return true;
};

defineComponent({ name: "LoginView" })
</script>

<template>
    <div class="main-content">
        <form id="login-form" class="form-content" @submit.prevent>
            <h2>{{ $t("login_form_title") }}</h2>
            <label class="form-label">{{ $t("login_label_email") }}</label>
            <input type="email" id="login-email" required="true" autocomplete="email" :readonly="busy"/>
            <label class="form-label">{{ $t("login_label_password") }}</label>
            <input type="password" id="login-password" required="true" autocomplete="current-password" :readonly="busy"/>
            <br />
            <label id="login-failed-message" v-if="loginError">{{ $t("login_result_failed") }}</label>
            <input type="submit" :value="$t('login_form_submit')" :readonly="busy" @click="onLogin" />
        </form>
    </div>
</template>

<style scoped>
.main-content
{
    width: 50%;
    min-width: 300px;
    max-width: 500px;
}

.form-content
{
    display: flex;
    flex-direction: column;
    width: 50%;
    box-shadow: 0 0 5px var(--shadow-color);
    background-color: var(--panel-background-color);
    padding: 2rem 3rem;
    flex-grow: 1;
}

#login-failed-message
{
    color: var(--error-color);
}

.form-label {
    padding-top: 0.5rem;
}

input[type=submit] {
    margin: 1rem;
}

input[type=email], input[type=password] {
    padding: 0.5rem;
    margin: 0.2rem 0;
}
</style>
