<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { l } from '@/locales';
import useLogin from '@/context/login';
import Spinner from '@/components/common/Spinner.vue';

const state = reactive<{
    busy: boolean,
    error: boolean,
    username?: string,
    password?: string
}>({
    busy: true,
    error: false
});

onMounted(() => {
    useLogin()
        .redirectToLogin()
        .then(ok => { state.error = !ok; })
        .finally(() => { state.busy = false; })
})
</script>

<template>
    <div class="login-view">
        <template v-if="state.busy">
            <Spinner />
            <div class="login-message">{{ $t(l.login_redirect) }}</div>
        </template>
        <div class="login-error" v-if="state.error">
            {{ $t(l.login_failure) }}
        </div>
    </div>
</template>

<style lang="scss" scoped>
.login-view {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    max-width: 42rem;
    margin: auto;
}
</style>
