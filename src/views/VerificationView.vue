<script setup lang="ts">
import { l } from '@/locales';
import { router } from '@/router';
import { reactive } from 'vue';
import useLogin from '@/context/login';
import Spinner from '@/components/common/Spinner.vue';
import DialogModal from "@/components/layout/DialogModal.vue";

const login = useLogin();

const state = reactive<{
    busy: boolean,
    error?: string,
    code: string,
    codeSent: boolean,
    validCode: boolean,
    showConfirmLogout: boolean,
    showLastChatButton: boolean
}>({
    busy: false,
    code: "",
    codeSent: false,
    validCode: false,
    showConfirmLogout: false,
    showLastChatButton: false
});

const onConfirmLogout = async () => {
    state.showConfirmLogout = false;
    await login.logout();
    router.push("/");
}
const onVerify = () => {
    state.busy = true;
    login.verifyAccount(state.code)
        .then((status) => {
            if (status)
                router.replace("/")
            else
                state.error = l.error_verification_failure
        })
        .finally(() => { state.busy = false })
}

const filterInput = (e: Event) => {
    const field = e.target as HTMLInputElement
    const match = field.value.match(/(\d+)/g)
    field.value = match?.join("") || ""
    state.validCode = field.value.length === 6
}

const onResend = () => {
    state.busy = true;
    login.resendVerification()
        .then((status => {
            if (status)
                state.codeSent = true;
            else
                state.error = l.error_verification_resend_failed
        }))
        .finally(() => { state.busy = false })
}
</script>

<template>
    <div id="verification-code-view">
        <div id="verification-code-container">
            <h3>{{ $t(l.verification_heading) }}</h3>
            <div>{{ $t(l.verification_description) }}</div>
            <form id="verification-code-form" @submit.prevent>
                <input id="verification-code" type="text" maxlength="6" autocomplete="off" autofocus="true"
                    v-model="state.code" :readonly="state.busy" inputmode="numeric" @input="filterInput" />
                <div id="verification-error" v-if="state.error && !state.busy">{{ $t(state.error) }}</div>
                <input type="submit" :value="$t(l.verification_button_verify)" @click="onVerify"
                    :disabled="!state.validCode" v-if="!state.busy" />
            </form>
            <Spinner v-if="state.busy" />
            <template v-if="!state.busy">
                <span v-if="!state.codeSent" id="resend-verification-button" @click="onResend">
                    {{ $t(l.verification_code_resend) }}
                </span>
                <span v-if="state.codeSent" id="resend-verification-notify">
                    {{ $t(l.verification_code_resend_done) }}
                </span>
            </template>
            <div id="verification-code-logout" @click="state.showConfirmLogout = !state.showConfirmLogout">
                {{ $t(l.nav_logout) }}
            </div>
        </div>
    </div>
    <DialogModal :active="state.showConfirmLogout" :buttons="[
                { loc_key: l.button_accept },
                { loc_key: l.button_cancel },
            ]" @select="(i: number) => {
                if (i == 0) { onConfirmLogout() }
                else if (i == 1) { state.showConfirmLogout = false; }
            }">
        {{ $t(l.popup_confirm_logout) }}
    </DialogModal>
</template>

<style lang="scss" scoped>
#verification-code-view {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    align-items: center;
    justify-content: center;
}

#verification-code-container {
    display: flex;
    flex-direction: column;
    padding: 1rem 2rem;
    margin: 1rem auto;
    border: 1px solid var(--border-color);
    border-radius: 1rem;
    text-align: center;
    align-items: center;
}

#verification-code-form {
    display: flex;
    text-align: center;
    flex-direction: column;
    gap: 1rem;
    margin: 1rem;
}

#verification-code {
    font-size: 3rem;
    text-align: center;
}

#verification-error {
    color: var(--error-color);
}

#resend-verification-button {
    cursor: pointer;
    color: var(--accent-primary-color);
    text-decoration: underline;
    font-size: small;
}

#resend-verification-notify {
    cursor: wait;
    color: var(--accent-secondary-color);
    font-size: small;
    font-style: italic;
}

#verification-code-logout {
    padding-top: 2rem;
}
</style>