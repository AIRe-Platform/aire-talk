<!-- 
    This Source Code Form is subject to the terms of the Mozilla Public
    License, v. 2.0. If a copy of the MPL was not distributed with this
    file, You can obtain one at https://mozilla.org/MPL/2.0/.
-->

<script setup lang="ts">
import Spinner from '@/components/common/Spinner.vue';
import useLogin from '@/context/login';
import usePlatform from '@/context/platform';
import { setUILanguage } from '@/locales';
import { AireServices, AireStatus } from 'aire';
import { LanguageCode } from 'iso-639-1';
import { onMounted, reactive } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const login = useLogin();

const state = reactive<{
    busy: boolean,
    status?: AireStatus,
}>({
    busy: true
})

const checkInviteCode = async () => {
    const inviteToken = route.params.code?.toString();
    const platform = route.query.platform?.toString();
    const lang = route.query.lang?.toString();

    // Change language
    if (lang) {
        setUILanguage(lang as LanguageCode);
    }

    // Check token exists and services available
    if (!inviteToken || !AireServices.ID) {
        router.push("/");
        return;
    }

    state.busy = true;
    state.status = undefined;

    // Logout from any existing session
    if (login.session) {
        if (!login.isCurrentInviteSession(inviteToken)) {
            var returnParams = new URLSearchParams({
                "invite": inviteToken,
                "platform": platform ?? ""
            });
            await login.logout(returnParams);
        }
    }

    // Switch platform if needed
    if (platform) {
        await usePlatform().switch(platform, false)
            .then(valid => {
                if (!valid) router.push("/");
            })
    }

    // Finally, login using the invite token
    await login.loginWithInvitation(inviteToken)
        .then(res => {
            state.status = res;

            // Go to start page if invitation is not valid
            if (res !== AireStatus.Success)
                router.push({ name: "Start" });
        })
        .catch(() => {
            state.status = AireStatus.UnknownError;
        })
        .finally(() => {
            state.busy = false;
        })
}

onMounted(checkInviteCode);
</script>

<template>
    <div class="invite-view">
        <Spinner />
    </div>
</template>

<style scoped>
.invite-view {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 32rem;
    margin: auto;
}
</style>