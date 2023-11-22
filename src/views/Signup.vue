<script setup lang="ts">
import { defineComponent } from 'vue';

const onSignup = () => {
    alert("not implemented");
}

defineComponent({ name: "SignupView" })
</script>

<template>
    <div class="main-content">
        <form class="form-content" :on-submit="onSignup">
            <h2>{{ $t("signup_form_title") }}</h2>
            <label class="form-label">{{ $t("signup_label_email") }}</label>
            <input type="email" id="signup-email" required="true" autocomplete="email"/>
            <label class="form-label">{{ $t("signup_label_password") }}</label>
            <input type="password" id="signup-password" required="true" autocomplete="off"/>
            <label class="form-label">{{ $t("signup_label_confirm_password") }}</label>
            <input type="password" id="signup-password-confirm" required="true" autocomplete="off"/>
            <br />
            <input type="submit" :value="$t('signup_form_submit')"/>
        </form>
    </div>
</template>

<style scoped>
.main-content
{
    width: 50%;
    min-width: 300px;
    max-width: 500px;
}

.form-content
{
    display: flex;
    flex-direction: column;
    width: 60%;
    box-shadow: 0 0 5px var(--shadow-color);
    background-color: var(--panel-background-color);
    padding: 2rem 3rem;
    flex-grow: 1;
}

.form-label {
    padding-top: 0.5rem;
}

input[type=submit] {
    margin: 1rem;
}

input[type=email], input[type=password] {
    padding: 0.5rem;
    margin: 0.2rem 0;
}
</style>
