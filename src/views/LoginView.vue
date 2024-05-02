<script setup lang="ts">
import { ref, reactive } from 'vue';
import Spinner from '@/components/Spinner.vue';
import { l } from '@/locales';
import { login } from '@/context/login';
import { router } from '@/router';
import { useRoute } from 'vue-router';

const busy = ref(false);
const error = ref(false);
const route = useRoute();
const credentials = reactive<{
    username?: string,
    password?: string
}>({
    username: route.query.username as string || "",
    password: route.query.password as string || ""
});


const onLogin = (e: Event) => {
    const form = e.target as HTMLFormElement;
    if (!form.checkValidity())
        return;

    busy.value = true;
    login(credentials.username!, credentials.password!)
        .then((result) => {
            error.value = !result;
            if (result)
                router.replace("/home")
        })
        .finally(() => busy.value = false);
};
</script>

<template>
    <div class="login-view">
        <form id="login-form" class="form-content" @submit.prevent="onLogin">
            <h2>{{ $t(l.login_form_title) }}</h2>
            <label for="login-username" class="form-label">{{ $t(l.login_label_username) }}</label>
            <input v-model="credentials.username" type="text" id="login-username" required="true"
                autocomplete="username" :readonly="busy" />
            <label for="login-password" class="form-label">{{ $t(l.login_label_password) }}</label>
            <input v-model="credentials.password" type="password" id="login-password" required="true"
                autocomplete="current-password" :readonly="busy" />
            <br />
            <small id="login-failed-message" v-if="error">{{ $t(l.login_failure_message) }}</small>
            <input type="submit" :value="$t(l.login_form_submit)" v-if="!busy" />
            <div class="login-busy" v-if="busy">
                <Spinner />
            </div>
            <RouterLink to="/recovery" class="login-recovery-link">{{ $t(l.login_forgot_password) }}</RouterLink>
        </form>
    </div>
</template>

<style scoped>
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
</style>
