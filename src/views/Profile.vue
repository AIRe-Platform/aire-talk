<script setup lang="ts">
import Spinner from "@/components/Spinner.vue";
import { l } from "@/locales";
import { AireServices } from "@/lib/aire";
import { defineComponent, reactive, ref } from "vue";
import { Login, saveProfile, changePassword, logout } from "@/context/login";
import { AireUser } from "@/lib/aire/models/user";
import { router } from "@/router";

const busy = ref(false);
const profile = reactive<{
    uuid?: string;
    first_name?: string;
    last_name?: string;
    gender?: "male" | "female" | "other";
    age?: number;
    language?: string;
    country?: string;
    bio?: string;
    last_login?: string;
    eula_accepted?: string;
}>(Login.user || {});

const errors = reactive<{
    editProfile?: string;
    passwordChange?: string;
    deleteAccount?: string;
}>({});

const onSaveChanges = (e: Event) => {
    e.preventDefault();

    if (AireServices.ID && Login.user) {
        busy.value = true;
        const data: AireUser = { ...Login.user, ...profile };
        saveProfile(data)
            .then((result) => {
                if (result) {
                    Object.assign(profile, result);
                    errors.editProfile = undefined;
                } else {
                    errors.editProfile = l.error_profile_edit;
                }
            })
            .finally(() => (busy.value = false));
    }
};
const onCancel = (e: Event) => {
    e.preventDefault();
    router.push("/");
};

const currentPassword = ref<string>("");
const newPassword = ref<string>("");
const onChangePassword = (e: Event) => {
    e.preventDefault();
    const form = document.getElementById("password-form") as HTMLFormElement;

    if (!form.checkValidity()) return;

    if (AireServices.ID) {
        busy.value = true;
        changePassword(currentPassword.value, newPassword.value)
            .then((result) => {
                if (result) {
                    errors.passwordChange = undefined;
                } else {
                    errors.passwordChange = l.error_profile_change_password;
                }
            })
            .finally(() => {
                busy.value = false;
                currentPassword.value = "";
                newPassword.value = "";
            });
    }
};

const confirmPassword = ref("");
const keepAnonymizedData = ref(false);
const onDeleteAccount = (e: Event) => {
    e.preventDefault();
    const form = document.getElementById("delete-form") as HTMLFormElement;

    if (!form.checkValidity()) return;

    if (AireServices.ID && profile.uuid) {
        busy.value = true;
        AireServices.ID.deleteProfile(
            profile.uuid,
            confirmPassword.value,
            keepAnonymizedData.value
        )
            .then(async (result) => {
                if (result) {
                    await logout();
                    errors.deleteAccount = undefined;
                    router.push("/");
                } else {
                    errors.deleteAccount = l.error_profile_delete_account;
                }
            })
            .finally(() => (busy.value = false));
    }
};

const genderList = [
    { id: "male", name: l.gender_male },
    { id: "female", name: l.gender_female },
    { id: "other", name: l.gender_other },
];

defineComponent({ name: "ProfileView" });
</script>

<template>
    <div id="profile-view">
        <Spinner v-if="busy" />
        <div class="profile-content">
            <div class="profile-header">
                <div class="profile-logo">
                    <img
                        src="@/assets/images/aire-logo-letter.svg"
                        alt="Logo"
                    />
                </div>
                <div class="profile-header-text">
                    <h3>{{ $t(l.profile_title) }}</h3>
                </div>
            </div>
            <div class="profile-text-content">
                <div class="profile-text-content-info">
                    The current user according to AIRe analysis:
                    {{ profile.first_name }} {{ profile.last_name }},
                    {{ profile.age }} years old. From {{ profile.country }},
                    that speaks in {{ profile.language }}.
                </div>
            </div>
            <form id="profile-form" v-if="busy === false" @submit.prevent>
                <span class="form-row">
                    <label for="first_name">{{
                        $t(l.profile_label_first_name)
                    }}</label>
                    <input
                        id="first_name"
                        class="form-input profile-input"
                        type="text"
                        v-model="profile.first_name"
                        autocomplete="given-name"
                    />
                    <button class="profile-edit-button" @click="onSaveChanges">
                        <font-awesome-icon icon="fa-solid fa-pen" />
                    </button>
                    <label for="last_name">{{
                        $t(l.profile_label_last_name)
                    }}</label>
                    <input
                        id="last_name"
                        type="text"
                        class="profile-input"
                        v-model="profile.last_name"
                        autocomplete="family-name"
                    />
                    <button class="profile-edit-button" @click="onSaveChanges">
                        <font-awesome-icon icon="fa-solid fa-pen" />
                    </button>
                </span>

                <span class="form-row">
                    <label for="gender">{{ $t(l.profile_label_gender) }}</label>
                    <select id="gender" v-model="profile.gender">
                        <option
                            v-for="g in genderList"
                            :key="g.id"
                            :value="g.id"
                        >
                            {{ $t(g.name) }}
                        </option>
                    </select>
                    <button class="profile-edit-button" @click="onSaveChanges">
                        <font-awesome-icon icon="fa-solid fa-pen" />
                    </button>
                    <label for="age">{{ $t(l.profile_label_age) }}</label>
                    <input
                        id="age"
                        type="number"
                        class="profile-input"
                        v-model="profile.age"
                        min="0"
                        max="150"
                    />
                    <button class="profile-edit-button" @click="onSaveChanges">
                        <font-awesome-icon icon="fa-solid fa-pen" />
                    </button>
                </span>

                <span class="form-row">
                    <label for="language">{{
                        $t(l.profile_label_language)
                    }}</label>
                    <input
                        id="language"
                        type="text"
                        class="profile-input"
                        v-model="profile.language"
                    />
                    <button class="profile-edit-button" @click="onSaveChanges">
                        <font-awesome-icon icon="fa-solid fa-pen" />
                    </button>
                    <label for="country">{{
                        $t(l.profile_label_country)
                    }}</label>
                    <input
                        id="country"
                        class="profile-input"
                        type="text"
                        v-model="profile.country"
                        autocomplete="country-name"
                    />
                    <button class="profile-edit-button" @click="onSaveChanges">
                        <font-awesome-icon icon="fa-solid fa-pen" />
                    </button>
                </span>
                <span class="form-row align-items-flex-start">
                    <label for="bio">{{ $t(l.profile_label_bio) }}</label>
                    <textarea
                        id="bio"
                        rows="4"
                        cols="30"
                        v-model="profile.bio"
                    ></textarea>
                    <button class="profile-edit-button" @click="onSaveChanges">
                        <font-awesome-icon icon="fa-solid fa-pen" />
                    </button>
                </span>
                <div class="error-message" v-if="errors.editProfile">
                    {{ $t(errors.editProfile) }}
                </div>

                <div class="profile-created-row" style="display: none">
                    Profile created: {{ profile.eula_accepted }}
                </div>

                <div class="buttons-row">
                    <span class="form-row">
                        <input
                            class="form-buttons"
                            type="submit"
                            :value="$t(l.button_cancel)"
                            @click="onCancel"
                        />
                        <input
                            class="form-buttons"
                            type="submit"
                            :value="$t(l.profile_button_save)"
                            @click="onSaveChanges"
                        />
                    </span>
                </div>
            </form>
            <div id="profile-connections" v-if="busy === false">
                <h3>{{ $t(l.profile_heading_connected_services) }}</h3>
                <div id="service-list">
                    {{ $t(l.profile_empty_service_list) }}
                </div>
            </div>
            <form id="password-form" v-if="busy === false" @submit.prevent>
                <h3>{{ $t(l.profile_heading_password) }}</h3>
                <input
                    hidden="true"
                    type="text"
                    id="username"
                    autocomplete="off"
                />
                <span class="form-row">
                    <label for="current_password">{{
                        $t(l.profile_label_current_password)
                    }}</label>
                    <input
                        class="profile-input margin-right"
                        id="current_password"
                        type="password"
                        required="true"
                        autocomplete="current-password"
                        v-model="currentPassword"
                    />
                    <label for="new_password">{{
                        $t(l.profile_label_new_password)
                    }}</label>
                    <input
                        class="profile-input"
                        id="new_password"
                        type="password"
                        required="true"
                        minlength="6"
                        autocomplete="new-password"
                        v-model="newPassword"
                    />
                </span>
                <div class="desc">{{ $t(l.profile_description_password) }}</div>
                <div class="error-message" v-if="errors.passwordChange">
                    {{ $t(errors.passwordChange) }}
                </div>
                <div class="buttons-row">
                    <input
                        class="form-buttons"
                        type="submit"
                        :value="$t(l.profile_button_change_password)"
                        @click="onChangePassword"
                    />
                </div>
            </form>
            <form id="delete-form" v-if="busy === false" @submit.prevent>
                <h3>{{ $t(l.profile_heading_delete_accout) }}</h3>
                <div class="desc">
                    {{ $t(l.profile_description_delete_account) }}
                </div>
                <span class="form-row">
                    <label for="confirm_password">{{
                        $t(l.profile_label_password_confirm)
                    }}</label>
                    <input
                        class="profile-input"
                        id="confirm_password"
                        type="password"
                        required="true"
                        autocomplete="off"
                        v-model="confirmPassword"
                    />
                </span>
                <span
                    class="form-row form-toggle"
                    @click.stop="keepAnonymizedData = !keepAnonymizedData"
                >
                    <input
                        id="keep_anonymized_data"
                        type="checkbox"
                        v-model="keepAnonymizedData"
                    />
                    <label
                        for="keep_anonymized_data"
                        class="checkbox-label"
                        @click.stop=""
                    >
                        {{ $t(l.profile_label_keep_anonymized_data) }}
                    </label>
                </span>
                <div class="error-message" v-if="errors.deleteAccount">
                    {{ $t(errors.deleteAccount) }}
                </div>
                <div class="buttons-row">
                    <input
                        class="form-buttons"
                        type="submit"
                        :value="$t(l.profile_button_delete)"
                        @click="onDeleteAccount"
                    />
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>
#profile-view {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    margin: auto;
    padding: 4rem 8rem;
}

.profile-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 2rem;
    border-bottom-style: solid;
    border-color: var(--accent-primary-color);
    margin-bottom: 2rem;
}
.profile-logo {
    width: 7rem;
}

.margin-right {
    margin-right: 5rem;
}
.profile-header-text {
    margin-top: 3rem;
}

.profile-text-content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-bottom: 4rem;
}
.profile-edit-button {
    width: 1%;
    height: 1%;
    border-radius: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--text-color);
    background-color: var(--chat-bubble-background-color);
    margin: 0rem 4rem 0rem 1rem;
}
.align-items-flex-start {
    align-items: flex-start !important;
}
.profile-text-content-info {
}
.profile-text-content-summary {
}
.profile-content {
    overflow: auto;
}
.profile-created-row {
    display: flex;
    justify-content: center;
    padding: 3rem;
    border-top-style: dotted;
    margin-top: 2rem;
}
#password-form,
#delete-form,
#profile-form,
#profile-connections {
    display: flex;
    flex-direction: column;
    border-bottom-style: dotted;
    padding: 1rem 1rem;
    margin-bottom: 1rem;
    background-color: var(--panel-background-color);
}

.form-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 1.25rem 0;
}
.profile-input {
    max-width: 17%;
    min-width: 17%;
}
.buttons-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
}
.form-buttons {
    max-width: 15rem;
    min-width: 15rem;
}

.desc {
    font-size: small;
    padding: 0.5rem;
    /* border: 1px solid var(--border-color); */
    border-radius: 0.5rem;
    margin: 0.5rem 0;
}

h3 {
    margin: 0;
    padding: 0 0 1rem 0;
}

input,
select {
    font-size: large;
    flex-grow: 2;
}

select {
    max-width: 19.3%;
    min-width: 19.3%;
}

input[type="submit"] {
    margin: 1rem 1rem 0 1rem;
}

input[type="checkbox"] {
    cursor: pointer;
}

textarea {
    width: 65%;
}

label {
    width: 16%;
}

.checkbox-label {
    width: 100%;
    margin-left: 1rem;
    margin-right: 0;
    cursor: pointer;
}

.form-toggle {
    margin: 0.5rem auto;
    padding: 0.5rem;
    /* border: 1px solid var(--border-color); */
    border-radius: 0.5rem;
    cursor: pointer;
    flex-direction: row;
    flex-wrap: nowrap;
}

/* mobile*/
@media screen and (max-width: 600px) {
    #profile-view {
        padding: 0.2rem;
        font-size: small;
    }
    .profile-header {
        padding-bottom: 0.5rem;
        margin-bottom: 0.5rem;
    }
    .profile-logo {
        width: 5rem;
    }
    .profile-header-text {
        margin-top: 1rem;
    }
    .profile-text-content {
        padding: 0rem 1rem 0rem 1rem;
        margin-bottom: 1rem;
    }
    #password-form,
    #delete-form,
    #profile-form,
    #profile-connections {
        min-width: unset;
        max-width: unset;
        width: unset;
    }
    .profile-input[data-v-ced23842] {
        max-width: 40%;
        min-width: 40%;
        margin-bottom: 1rem;
    }
    .profile-edit-button {
        margin: 0rem 1rem 0rem 1rem;
    }
    .form-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 0;
        justify-content: flex-start;
        flex-wrap: wrap;
        align-items: stretch;
    }
    select {
        max-width: 45.4%;
        min-width: 45.4%;
        margin-bottom: 1rem;
    }
    label {
        width: 30%;
        align-items: center;
        display: flex;
    }
    textarea {
        width: 40%;
    }
    .buttons-row {
        display: flex;
    }
    .margin-right {
        margin-right: 4rem;
    }
    .form-buttons {
        max-width: 8rem;
        display: flex;
        min-width: 8rem;
        font-size: small;
        justify-content: space-around;
    }
}
</style>
