<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->


<script setup lang="ts">
import { reactive } from 'vue';
import { getUILanguage, l } from '@/locales';
import { AireServices, AireStatus } from 'aire';
import Panel from '@/components/common/Panel.vue';
import Spinner from '@/components/common/Spinner.vue';

const state = reactive<{
    busy: boolean,
    code_sent: boolean,
    completed: boolean,
    valid_code: boolean,
    error?: string
}>({
    busy: false,
    code_sent: false,
    completed: false,
    valid_code: false
});

const form = reactive<{
    email: string,
    code: string,
    password: string
}>({
    email: "",
    code: "",
    password: ""
})

const requestCode = async () => {
    if (AireServices.ID) {
        return await AireServices.ID.recoveryRequestCode(form.email, getUILanguage())
            .then(status => {
                if (status == AireStatus.Success)
                    state.code_sent = true;
                else
                    state.error = l.recovery_failure;
                return status;
            })
    }
    return AireStatus.UnknownError;
}

const changePassword = async () => {
    if (AireServices.ID) {
        return await AireServices.ID.recoveryChangePassword(form.email, form.code, form.password, getUILanguage())
            .then(status => {
                if (status == AireStatus.Success)
                    state.completed = true;
                else
                    state.error = l.recovery_failure;
                return status;
            })
    }
    return AireStatus.UnknownError;
}

const onSubmit = (e: Event) => {
    const form = e.target as HTMLFormElement;
    if (!form.reportValidity())
        return;

    state.busy = true;
    state.error = undefined;

    let action: () => Promise<AireStatus>;

    if (state.code_sent)
        action = changePassword;
    else
        action = requestCode;

    action().finally(() => { state.busy = false; })
}

const checkCode = (e: Event) => {
    const field = e.target as HTMLInputElement
    const match = field.value.match(/(\d+)/g)
    field.value = match?.join("").substring(0, 6) || ""
    state.valid_code = field.value.length === 6
}
</script>

<template>
    <div class="recovery-view">
        <Panel class="recovery-panel">
            <h2>{{ state.completed ? $t(l.recovery_password_changed) : $t(l.recovery_heading) }}</h2>
            <form class="recovery-form" @submit.prevent="onSubmit" v-if="!state.completed">
                <label for="recovery-email">{{ $t(l.recovery_label_email) }}</label>
                <input id="recovery-email" type="email" autocomplete="email" :required="true"
                    :readonly="state.code_sent || state.busy" v-model="form.email" />
                <template v-if="state.code_sent">
                    <div class="recovery-code-instruction"> {{ $t(l.recovery_enter_code) }} </div>
                    <label for="recovery-code">{{ $t(l.recovery_label_code) }}</label>
                    <input id="recovery-code" type="text" autocomplete="off" :required="true" :readonly="state.busy"
                        @input="checkCode" v-model="form.code" />
                    <label for="recovery-password">{{ $t(l.recovery_label_password) }}</label>
                    <input id="recovery-password" type="password" autocomplete="new-password" :required="true"
                        :readonly="state.busy" v-model="form.password" />
                </template>
                <div class="recovery-error" v-if="state.error">{{ $t(state.error) }}</div>
                <input type="submit" :value="$t(l.button_continue)" v-if="!state.busy" />
                <Spinner v-if="state.busy" />
            </form>
            <RouterLink to="/login" class="recovery-back-link">{{ $t(l.recovery_back_to_login) }}</RouterLink>
        </Panel>
    </div>
</template>

<style lang="scss" scoped>
.recovery-view {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    max-width: 42rem;
    margin: auto;
}

.recovery-panel {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 2rem 3rem;
    width: 50%;
    background-color: var(--panel-background-color);
}

.recovery-form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.recovery-code-instruction {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 1rem;
    font-size: var(--font-small);
}

.spinner {
    align-self: center;
}

.recovery-back-link {
    font-size: var(--font-small);
    align-self: center;
    padding: 0.5rem;
    color: var(--link-color);
    text-decoration: underline;
}

.recovery-error {
    color: var(--error-color);
    align-self: center;
    margin-top: 1rem;
}

input[type=email],
input[type=text],
input[type=password] {
    font-size: var(--font-large);
}

input[type=submit] {
    align-self: center;
    margin-top: 1rem;
    width: 60%;
}

.ui-mode-mobile {
    .form-content {
        width: 70%;
        padding: 1rem 2rem;
    }
}
</style>