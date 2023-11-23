<script setup lang="ts">
import { Login, login } from '@/context/login';
import { router } from '@/router';
import { defineComponent, ref } from 'vue';
import Spinner from '@/components/Spinner.vue';

const busy = ref(false);
const error = ref(false);

const onLogin = (e: Event) => {
    e.preventDefault();
    
    if(busy.value)
        return false;

    const email = document.getElementById("login-email") as HTMLInputElement;
    const pw = document.getElementById("login-password") as HTMLInputElement;

    if(email.form?.checkValidity() !== true)
        return;

    busy.value = true;
    console.debug("Logging in...");

    login(email.value, pw.value)
        .then((result) => {
            error.value = !result;
            Login.logged_in = result;
            if(result)
                router.push("/");
        })
        .finally(() => busy.value = false);
};

defineComponent({ name: "LoginView" })
</script>

<template>
    <div class="main-content">
        <form id="login-form" class="form-content" @submit.prevent v-if="busy === false">
            <h2>{{ $t("login_form_title") }}</h2>
            <label class="form-label">{{ $t("login_label_email") }}</label>
            <input type="email" id="login-email" required="true" autocomplete="email"/>
            <label class="form-label">{{ $t("login_label_password") }}</label>
            <input type="password" id="login-password" required="true" autocomplete="current-password"/>
            <br />
            <label id="login-failed-message" v-if="error">{{ $t("login_failure_message") }}</label>
            <input type="submit" :value="$t('login_form_submit')" @click="onLogin" />
        </form>
        <div class="busy-panel" v-if="busy">
            <Spinner />
        </div>
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

.busy-panel {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50%;
    box-shadow: 0 0 5px var(--shadow-color);
    background-color: var(--panel-background-color);
    padding: 2rem 3rem;
    flex-grow: 1;
}

#login-failed-message
{
    color: var(--error-color);
    white-space: pre-line;
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
