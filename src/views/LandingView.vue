<script setup lang="ts">
import { Chat } from '@/context/chat';
import { l } from '@/locales';
import { router } from '@/router';
import { ref } from 'vue';

const occupation = ref("");
const age = ref<number>();
const isFormCompleted = ref(false);

const checkForm = () => {
    isFormCompleted.value = (occupation.value.length > 0 && age.value != null);
};

const saveForm = (e: Event) => {
    e.preventDefault();
    Chat.landingInfo = {
        age: age.value!,
        occupation: occupation.value
    }
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
                v-model.number="age" />
            <label for="occupation"> {{ $t(l.landing_label_occupation) }} </label>
            <input id="occupation" type="text" required="true" autocomplete="off" @input="checkForm" v-model="occupation">
            <div class="landing-form-buttons">
                <button>
                    <RouterLink class="nav-link" to="/">{{ $t(l.button_back) }}</RouterLink>
                </button>
                <button :disabled="!isFormCompleted" @click="saveForm">
                    {{ $t(l.button_continue) }}
                </button>
            </div>
        </form>
    </div>
</template>

<style scoped>
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
    font-size: small;
}

input {
    font-size: large;
    margin-bottom: 0.5rem;
}
</style>