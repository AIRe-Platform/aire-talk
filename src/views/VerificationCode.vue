<script setup lang="ts">
import Spinner from '@/components/Spinner.vue';
import { resendVerification, verifyAccount } from '@/context/login';
import { l } from '@/locales';
import { router } from '@/router';
import { defineComponent, ref } from 'vue';

let code = "";
const busy = ref(false)
const error = ref<string>()
const codeSent = ref(false)
const validCode = ref(false)

const onVerify = () => {
    busy.value = true;
    verifyAccount(code)
        .then((status) => {
            if(status)
                router.push("/")
            else
                error.value = l.error_verification_failure
        })
        .finally(() => { busy.value = false })
}

const filterInput = (e: Event) => {
    const field = e.target as HTMLInputElement
    const match = field.value.match(/(\d+)/g)
    field.value = match?.join("") || ""
    validCode.value = field.value.length === 6
}

const onResend = () => {
    busy.value = true;
    resendVerification()
        .then((status => {
            if(status) 
                codeSent.value = true;
            else
                error.value = l.error_verification_resend_failed
        }))
        .finally(() => { busy.value = false })
}

defineComponent({
    name: "VerificationCodeView"
})
</script>

<template>
    <div id="verification-code-view">
        <div id="verification-code-container">
            <h3>{{ $t(l.verification_heading) }}</h3>
            <div>{{ $t(l.verification_description) }}</div>
            <form id="verification-code-form" @submit.prevent>
                <input id="verification-code" type="text" maxlength="6" autocomplete="off" autofocus="true" v-model="code" :readonly="busy" inputmode="numeric" @input="filterInput"/>
                <div id="verification-error" v-if="error && !busy">{{ $t(error) }}</div>
                <input type="submit" :value="$t(l.verification_button_verify)" @click="onVerify" :disabled="!validCode" v-if="!busy"/>
            </form>
            <Spinner v-if="busy" />
            <template v-if="!busy">
                <span v-if="!codeSent" id="resend-verification-button" @click="onResend">{{ $t(l.verification_code_resend )}}</span>
                <span v-if="codeSent" id="resend-verification-notify">{{ $t(l.verification_code_resend_done)}}</span>
            </template>
        </div>
    </div>
</template>

<style scoped>
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
</style>