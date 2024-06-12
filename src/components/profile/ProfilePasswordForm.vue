<script setup lang="ts">
import { reactive } from 'vue';
import { AireServices } from 'aire';
import { l } from '@/locales';
import useLogin from '@/context/login';
import Spinner from '@/components/common/Spinner.vue';

const state = reactive<{
    error?: string,
    busy: boolean,
    currentPassword: string,
    newPassword: string
}>({
    busy: false,
    currentPassword: "",
    newPassword: ""
});

const onChangePassword = (e: Event) => {
    const form = e.target as HTMLFormElement;
    if (!form.checkValidity())
        return;

    if (AireServices.ID) {
        state.busy = true;
        useLogin().changePassword(state.currentPassword, state.newPassword)
            .then((result) => {
                if (result) {
                    state.error = undefined;
                } else {
                    state.error = l.error_profile_change_password;
                }
            })
            .finally(() => {
                state.busy = false;
                state.currentPassword = "";
                state.newPassword = "";
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
                    v-model="state.currentPassword" :readonly="state.busy" />
            </span>
            <span class="form-item">
                <label class="form-label" for="new_password">{{ $t(l.profile_label_new_password) }}</label>
                <input id="new_password" type="password" required="true" minlength="6" autocomplete="new-password"
                    v-model="state.newPassword" :readonly="state.busy" />
            </span>
        </div>
        <div class="description">{{ $t(l.profile_description_password) }}</div>
        <div class="error-message" v-if="state.error">{{ $t(state.error) }}</div>
        <div class="form-buttons">
            <template v-if="!state.busy">
                <input type="submit" :value="$t(l.profile_button_change_password)" />
            </template>
            <Spinner v-if="state.busy" />
        </div>
    </form>
</template>

<style lang="scss" scoped>
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
        font-size: var(--font-large);
    }
}

.description {
    font-size: var(--font-small);
    padding: 1rem;
    border: 1px solid var(--border-color);
    border-radius: 1rem;
    background-color: var(--panel-menu-background-color);
}

.error-message {
    color: var(--background-color);
    font-size: var(--font-small);
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