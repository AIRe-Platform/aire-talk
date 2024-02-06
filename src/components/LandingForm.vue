<script setup lang="ts">
import { defineComponent, ref } from 'vue';
import { l } from '@/locales';
import { Chat } from "@/context/chat";
import { router } from "@/router";
import { RouterLink } from 'vue-router';
defineComponent({ name: "LandingFormView" })

const occupation = ref("");
const age = ref();
const isFormCompleted = ref(false);

/**
 * Check if there is answwered all questions to activate the button to proceed.
 */
const checkForm = () => {
    console.log("( occupation.value.length > 0 && age.value != null ) ", (occupation.value.length > 0 && age.value != null));
    isFormCompleted.value = (occupation.value.length > 0 && age.value != null);
    console.log("isFormCompleted ", isFormCompleted);
};

/**
 * Save the form imput and send the information to the next view.
 */
const saveForm = (e: Event) => {
    e.preventDefault();
    Chat.landingInfo = { 
        age: age.value,
        occupation: occupation.value
    }
    router.push("/chat");
};

</script> 

<template>
    <div class="landing-form-wrapper">
        <div class="landing-form-content">
            <h3 class="landing-form-line">{{ $t(l.landing_view_title) }} </h3>
            <div class="landing-form-line">{{ $t(l.landing_view_text) }}</div>
            <form class="landing-form-form" @change="checkForm">
                <label>
                    {{ $t(l.landing_view_first_question) }}
                </label>
                <input id="" class="" type="number" min="1" autofocus autocomplete="off" @change="checkForm"
                    v-model.number="age" />
                <label>
                    {{ $t(l.landing_view_second_question) }}
                </label>
                <input @change="checkForm" v-model="occupation">
                <div> {{ $t(l.landing_view_occupations) }} </div>
                <div class="landing-form-occupation">{{ occupation }}</div>
            </form>
            <div class="landing-form-button">
                <button class="btn">
                    <RouterLink class="nav-link" to="/">{{ $t(l.landing_view_form_button_cancel) }}</RouterLink>
                </button>
                <button class="btn" :disabled="!isFormCompleted" @click="saveForm">
                    {{ $t(l.landing_view_form_continue_button) }}
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped>
.landing-form-wrapper {
    margin: auto;
    width: 50%;
    border-radius: 10px;
    box-shadow: 0 0 5px var(--shadow-color);
}

.landing-form-content {
    margin: 3rem;
}

.landing-form-line {
    margin: 2rem;
}

.landing-form-form {
    display: flex;
    flex-direction: column;
    margin: 2rem;
}

.landing-form-button {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 2rem;
}

.landing-form-occupation {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: 2rem;
}

button:disabled,
button[disabled] {
    border: 1px solid #999999;
    background-color: #cccccc;
    color: #666666;
    cursor: not-allowed;
}

button:hover {
    background-color: #cccccc !important;
}
</style>