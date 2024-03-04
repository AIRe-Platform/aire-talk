<script setup lang="ts">
import { ref } from 'vue';
import { changePassword } from "@/context/login";
import { AireServices } from 'aire';
import { l } from '@/locales';
import Spinner from '../Spinner.vue';

const error = ref<string>();
const busy = ref(false);
const currentPassword = ref<string>("");
const newPassword = ref<string>("");

const onChangePassword = (e: Event) => {
    const form = e.target as HTMLFormElement;
    if (!form.checkValidity())
        return;

    if (AireServices.ID) {
        busy.value = true;
        changePassword(currentPassword.value, newPassword.value)
            .then((result) => {
                if (result) {
                    error.value = undefined;
                } else {
                    error.value = l.error_profile_change_password;
                }
            })
            .finally(() => {
                busy.value = false;
                currentPassword.value = "";
                newPassword.value = "";
            });
    }
};
</script>

<template>
    <form class="password-form" @submit.prevent="onChangePassword">
        <h3>{{ $t(l.profile_heading_password) }}</h3>
        <input hidden="true" type="text" id="username" autocomplete="off" />
        <div class="form-content">
            <span class="form-item">
                <label class="form-label" for="current_password">{{ $t(l.profile_label_current_password) }}</label>
                <input id="current_password" type="password" required="true" autocomplete="current-password"
                    v-model="currentPassword" :readonly="busy" />
            </span>
            <span class="form-item">
                <label class="form-label" for="new_password">{{ $t(l.profile_label_new_password) }}</label>
                <input id="new_password" type="password" required="true" minlength="6" autocomplete="new-password"
                    v-model="newPassword" :readonly="busy" />
            </span>
        </div>
        <div class="description">{{ $t(l.profile_description_password) }}</div>
        <div class="error-message" v-if="error">{{ $t(error) }}</div>
        <div class="form-buttons">
            <template v-if="!busy">
                <input type="submit" :value="$t(l.profile_button_change_password)" />
            </template>
            <Spinner v-if="busy" />
        </div>
    </form>
</template>

<style scoped>
.password-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.form-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 400px;
}

.form-item {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem;
    flex-grow: 1;

    label {
        flex-basis: 20%;
        flex-grow: 1;
    }

    input {
        flex-basis: 20%;
        flex-grow: 1;
        font-size: large;
    }
}

.description {
    font-size: small;
    padding: 1rem;
    border: 1px solid var(--border-color);
    border-radius: 1rem;
    background-color: var(--background-color);
}

.error-message {
    color: var(--background-color);
    font-size: small;
    padding: 1rem;
    border: 1px solid var(--border-color);
    border-radius: 1rem;
    background-color: var(--error-color);
}

.form-buttons {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    align-items: flex-start;
    justify-content: center;
}
</style>