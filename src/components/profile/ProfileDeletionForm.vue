<script setup lang="ts">
import { ref } from 'vue';
import { Login, logout } from "@/context/login";
import { AireServices, AireStatus } from 'aire';
import { router } from '@/router';
import { l } from '@/locales';
import Spinner from "@/components/Spinner.vue";

const error = ref<string>();
const busy = ref(false);
const confirmPassword = ref("");
const keepAnonymizedData = ref(false);

const onDeleteAccount = (e: Event) => {
    const form = e.target as HTMLFormElement;
    if (!form.checkValidity())
        return;

    if (AireServices.ID && Login.user?.uuid) {
        busy.value = true;
        AireServices.ID.deleteProfile(
            Login.user?.uuid,
            confirmPassword.value,
            keepAnonymizedData.value
        )
            .then(async (status) => {
                if (status == AireStatus.Success) {
                    await logout();
                    error.value = undefined;
                    router.push("/");
                } else {
                    error.value = l.error_profile_delete_account;
                }
            })
            .finally(() => (busy.value = false));
    }
};
</script>

<template>
    <form id="delete-form" @submit.prevent="onDeleteAccount">
        <h3>{{ $t(l.profile_heading_delete_accout) }}</h3>
        <div class="form-row description">{{ $t(l.profile_description_delete_account) }}</div>
        <div class="form-content">
            <span class="form-item">
                <label for="confirm_password">{{ $t(l.profile_label_password_confirm) }}</label>
                <input class="profile-input" id="confirm_password" type="password" required="true" autocomplete="off"
                    v-model="confirmPassword" :readonly="busy" />
            </span>
            <span class="form-toggle" @click.stop="">
                <input id="keep_anonymized_data" type="checkbox" v-model="keepAnonymizedData" :disabled="busy" />
                <label for="keep_anonymized_data" class="checkbox-label" @click.stop="">
                    {{ $t(l.profile_label_keep_anonymized_data) }}
                </label>
            </span>
        </div>
        <div class="error-message" v-if="error">{{ $t(error) }}</div>
        <div class="form-buttons">
            <template v-if="!busy">
                <input type="submit" :value="$t(l.profile_button_delete)" />
            </template>
            <Spinner v-if="busy" />
        </div>
    </form>
</template>

<style scoped>
#delete-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.form-content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.form-item {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    gap: 1rem;
    flex-grow: 1;
    max-width: 400px;

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

input[type="checkbox"] {
    cursor: pointer;
}

.checkbox-label {
    width: 100%;
    font-size: small;
    margin-left: 1rem;
    margin-right: 0;
    cursor: pointer;
}

.form-toggle {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;

    margin: 0.5rem auto;
    padding: 1rem;

    border: 1px solid var(--border-color);
    border-radius: 0.5rem;

    cursor: pointer;
}
</style>