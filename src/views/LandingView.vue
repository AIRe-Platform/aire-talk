// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.


<script setup lang="ts">
import useChat from '@/context/chat';
import { l } from '@/locales';
import { router } from '@/router';
import { reactive } from 'vue';

const state = reactive<{
    occupation: string,
    age?: number,
    completed: boolean
}>({
    occupation: "",
    completed: false
});

const chat = useChat();

const checkForm = () => {
    state.completed = (state.occupation?.length > 0 && state.age !== undefined);
};

const saveForm = (e: Event) => {
    e.preventDefault();
    chat.meta.age = state.age;
    chat.meta.occupation = state.occupation;
    router.push("/chat");
};
</script>

<template>
    <div id="landing-view">
        <form class="landing-form" @change="checkForm">
            <h3 class="landing-form-line">{{ $t(l.landing_view_title) }} </h3>
            <div class="landing-form-line">{{ $t(l.landing_view_text) }}</div>
            <label> {{ $t(l.landing_label_age) }} </label>
            <input id="age" type="number" required="true" min="0" autofocus autocomplete="off" @input="checkForm"
                v-model.number="state.age" />
            <label for="occupation"> {{ $t(l.landing_label_occupation) }} </label>
            <input id="occupation" type="text" required="true" autocomplete="off" @input="checkForm"
                v-model="state.occupation">
            <div class="landing-form-buttons">
                <button>
                    <RouterLink class="nav-link" to="/">{{ $t(l.button_back) }}</RouterLink>
                </button>
                <button :disabled="!state.completed" @click="saveForm">
                    {{ $t(l.button_continue) }}
                </button>
            </div>
        </form>
    </div>
</template>

<style lang="scss" scoped>
#landing-view {
    margin: auto;
    width: 50%;
    border-radius: 10px;
    box-shadow: 0 0 5px var(--shadow-color);
}

.landing-form {
    display: flex;
    flex-direction: column;
    margin: 1rem 2rem;
    gap: 0.5rem;
}

.landing-form-buttons {
    display: flex;
    flex-direction: row;
    padding: 1rem 0;
    justify-content: space-between;
}

.landing-form-occupation {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 2rem;
}

label {
    font-size: var(--font-small);
}

input {
    font-size: var(--font-large);
    margin-bottom: 0.5rem;
}
</style>