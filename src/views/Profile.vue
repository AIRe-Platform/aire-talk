<script setup lang="ts">
import Spinner from '@/components/Spinner.vue';
import { l } from '@/locales';
import { AireServices } from '@/lib/aire';
import { defineComponent, ref } from 'vue';
import { Login, changePassword, logout } from '@/context/login';

const getProfile = () => {
    return Login.user
};

const profile = ref(getProfile());
const busy = ref(false);
const fistName = ref(profile.value?.first_name);
const lastName = ref(profile.value?.last_name);
const gender = ref(profile.value?.gender);
const age = ref(profile.value?.age);
const language = ref(profile.value?.language);
const country = ref(profile.value?.country);
const bio = ref(profile.value?.bio);

const editError = ref<string>();
const pwError = ref<string>();
const delError = ref<string>();

const onSaveChanges = (e: Event) => {
    e.preventDefault();

    if (profile.value == null)
        return;

    /*   if(!firstName.form?.checkValidity())
            return; */

    profile.value.first_name = fistName.value;
    profile.value.last_name = lastName.value;
    profile.value.gender = gender.value;
    profile.value.age = age.value;
    profile.value.language = language.value;
    profile.value.country = country.value;
    profile.value.bio = bio.value;

    if (AireServices.ID) {
        busy.value = true;
        AireServices.ID.saveProfileData(profile.value)
            .then((result) => {
                if (result) {
                    profile.value = getProfile();
                    editError.value = undefined;
                }
                else {
                    editError.value = l.error_profile_edit;
                }
            })
            .finally(() => busy.value = false);
    }
}

const onChangePassword = (e: Event) => {
    e.preventDefault();

    const current = document.getElementById("current_password") as HTMLInputElement;
    const newpw = document.getElementById("new_password") as HTMLInputElement;

    if (!current.form?.checkValidity())
        return;

    if (AireServices.ID) {
        busy.value = true;
        changePassword(current.value, newpw.value)
            .then((result) => {
                if (result) {
                    pwError.value = undefined;
                }
                else {
                    pwError.value = l.error_profile_change_password;
                }
            })
            .finally(() => busy.value = false)
    }
};

const onDeleteAccount = (e: Event) => {
    e.preventDefault();

    const pw = document.getElementById("confirm_password") as HTMLInputElement;
    const keepData = document.getElementById("keep_anonymized_data") as HTMLInputElement;

    if (!pw.form?.checkValidity())
        return;

    if (AireServices.ID && profile.value) {
        busy.value = true;
        AireServices.ID.deleteProfile(profile.value.uuid, pw.value, keepData.checked)
            .then((result) => {
                if (result) {
                    logout();
                    delError.value = undefined;
                }
                else {
                    delError.value = l.error_profile_delete_account;
                }
            })
            .finally(() => busy.value = false);
    }
}

const genderList = [
    { id: "male", name: l.gender_male },
    { id: "female", name: l.gender_female },
    { id: "other", name: l.gender_other }
];

const toggleCheckbox = (id: string) => {
    const cb = document.getElementById(id) as HTMLInputElement;
    if (cb)
        cb.checked = !cb.checked;
}

defineComponent({ name: "ProfileView" })
</script>

<template>
    <div id="profile-view">
        <h2>{{ $t(l.profile_title) }}</h2>
        <Spinner v-if="busy" />
        <div class="profile-content">
            <form id="profile-form" v-if="busy === false" @submit.prevent>
                <span class="form-row">
                    <label for="first_name">{{ $t(l.profile_label_first_name) }}</label>
                    <input id="first_name" class="form-input" type="text" v-model="fistName" autocomplete="given-name" />
                </span>
                <span class="form-row">
                    <label for="last_name">{{ $t(l.profile_label_last_name) }}</label>
                    <input id="last_name" type="text" v-model="lastName" autocomplete="family-name" />
                </span>
                <span class="form-row">
                    <label for="gender">{{ $t(l.profile_label_gender) }}</label>
                    <select id="gender" v-model="gender">
                        <option v-for="g in genderList" :key="g.id" :value="g.id">{{ $t(g.name) }}</option>
                    </select>
                </span>
                <span class="form-row">
                    <label for="age">{{ $t(l.profile_label_age) }}</label>
                    <input id="age" type="number" v-model="age" min="0" max="150" />
                </span>
                <span class="form-row">
                    <label for="language">{{ $t(l.profile_label_language) }}</label>
                    <input id="language" type="text" v-model="language" />
                </span>
                <span class="form-row">
                    <label for="country">{{ $t(l.profile_label_country) }}</label>
                    <input id="country" type="text" v-model="country" autocomplete="country-name" />
                </span>
                <span class="form-row">
                    <label for="bio">{{ $t(l.profile_label_bio) }}</label>
                    <textarea id="bio" rows="4" cols="30" v-model="bio"></textarea>
                </span>
                <div class="error-message" v-if="editError">{{ $t(editError) }}</div>
                <input type="submit" :value="$t(l.profile_button_save)" @click="onSaveChanges" />
            </form>
            <div id="profile-connections" v-if="busy === false">
                <h3>{{ $t(l.profile_heading_connected_services) }}</h3>
                <div id="service-list">
                    {{ $t(l.profile_empty_service_list) }}
                </div>
            </div>
            <form id="password-form" v-if="busy === false" @submit.prevent>
                <h3>{{ $t(l.profile_heading_password) }}</h3>
                <input hidden="true" type="text" id="username" autocomplete="off" />
                <span class="form-row">
                    <label for="current_password">{{ $t(l.profile_label_current_password) }}</label>
                    <input id="current_password" type="password" required="true" autocomplete="current-password" />
                </span>
                <span class="form-row">
                    <label for="new_password">{{ $t(l.profile_label_new_password) }}</label>
                    <input id="new_password" type="password" required="true" minlength="6" autocomplete="new-password" />
                </span>
                <div class="desc">{{ $t(l.profile_description_password) }}</div>
                <div class="error-message" v-if="pwError">{{ $t(pwError) }}</div>
                <input type="submit" :value="$t(l.profile_button_change_password)" @click="onChangePassword" />
            </form>
            <form id="delete-form" v-if="busy === false" @submit.prevent>
                <h3>{{ $t(l.profile_heading_delete_accout) }}</h3>
                <div class="desc">{{ $t(l.profile_description_delete_account) }}</div>
                <span class="form-row">
                    <label for="confirm_password">{{ $t(l.profile_label_password_confirm) }}</label>
                    <input id="confirm_password" type="password" required="true" autocomplete="off" />
                </span>
                <span class="form-row form-toggle">
                    <input id="keep_anonymized_data" type="checkbox" @change.prevent />
                    <label for="keep_anonymized_data" class="checkbox-label"
                        @click="toggleCheckbox('keep_anonymized_data')">{{
                            $t(l.profile_label_keep_anonymized_data) }}</label>
                </span>
                <div class="error-message" v-if="delError">{{ $t(delError) }}</div>
                <input type="submit" :value="$t(l.profile_button_delete)" @click="onDeleteAccount" />
            </form>
        </div>
    </div>
</template>

<style scoped>
#profile-view {
    padding: 1rem;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.profile-content {
    overflow: auto;
}

#password-form,
#delete-form,
#profile-form,
#profile-connections {
    display: flex;
    flex-direction: column;
    width: calc(100% - 4rem);
    max-width: 600px;
    border-radius: 1rem;
    background-color: var(--panel-background-color);
    border: 1px solid var(--border-color);
    padding: 1rem 1rem;
    margin-bottom: 1rem;
}

.form-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 0.25rem 0;
    overflow: hidden;
    flex-wrap: wrap;
}

.desc {
    font-size: small;
    padding: 0.5rem;
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    margin: 0.5rem 0;
}

h2 {
    color: var(--accent-primary-color);
}

h3 {
    margin: 0;
    padding: 0 0 1rem 0;
    color: var(--accent-secondary-color);
}

input,
select {
    font-size: large;
    flex-grow: 2;
}

input[type=submit] {
    margin: 1rem 1rem 0 1rem;
}

input[type=checkbox] {
    cursor: pointer;
}

label {
    width: 40%;
    margin-right: 1rem;
}

.checkbox-label {
    width: 100%;
    margin-left: 1rem;
    margin-right: 0;
    cursor: pointer;
}

.form-toggle {
    width: 80%;
    margin: 0.5rem auto;
    padding: 0.5rem;
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    cursor: pointer;
}

/* mobile*/
@media screen and (max-width: 600px) {
    #profile-view {
        padding: 0.2rem;
    }

    #password-form,
    #delete-form,
    #profile-form,
    #profile-connections {
        min-width: unset;
        max-width: unset;
        width: unset;
    }

    .form-row {
        flex-direction: column;
        margin: 0.5rem 0;
        justify-content: flex-start;
        align-items: stretch;
    }

    label {
        width: unset;
        margin: 0;
        margin-bottom: 0.25rem;
    }
}
</style>
