<script setup lang="ts">
import { reactive, ref } from 'vue';
import { AireServices, AireUser } from "aire";
import { Login, saveProfile } from "@/context/login";
import { l } from '@/locales';
import Spinner from "@/components/Spinner.vue";
import ISO6391 from 'iso-639-1';

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
const error = ref<string>()

const genderList = [
    { id: "male", name: l.gender_male },
    { id: "female", name: l.gender_female },
    { id: "other", name: l.gender_other },
];

const languages = ISO6391.getAllCodes().map(x => {
    return {
        name: `${ISO6391.getNativeName(x)} (${ISO6391.getName(x)})`,
        lang: x
    }
})

const onSaveChanges = (e: Event) => {
    const form = e.target as HTMLFormElement;
    if (!form.checkValidity())
        return;

    if (AireServices.ID && Login.user) {
        busy.value = true;
        const data: AireUser = { ...Login.user, ...profile };
        saveProfile(data)
            .then((result) => {
                if (result) {
                    Object.assign(profile, result);
                    error.value = undefined;
                } else {
                    error.value = l.error_profile_edit;
                }
            })
            .finally(() => (busy.value = false));
    }
};

const activateField = (id: string) => {
    const el = document.getElementById(id);
    el?.focus()
}
</script>

<template>
    <form class="profile-form" @submit.prevent="onSaveChanges">
        <span class="form-item">
            <label class="form-label" for="first-name">{{ $t(l.profile_label_first_name) }}</label>
            <div class="form-input">
                <input id="first-name" type="text" v-model="profile.first_name" autocomplete="given-name"
                    :readonly="busy" />
                <button class="profile-edit-button" @click.prevent="activateField('first-name')" :disabled="busy">
                    <font-awesome-icon icon="fa-solid fa-pen" />
                </button>
            </div>
        </span>
        <span class="form-item">
            <label class="form-label" for="last-name">{{ $t(l.profile_label_last_name) }}</label>
            <div class="form-input">
                <input id="last-name" type="text" v-model="profile.last_name" autocomplete="family-name"
                    :readonly="busy" />
                <button class="profile-edit-button" @click.prevent="activateField('last-name')" :disabled="busy">
                    <font-awesome-icon icon="fa-solid fa-pen" />
                </button>
            </div>
        </span>
        <span class="form-item">
            <label class="form-label" for="gender">{{ $t(l.profile_label_gender) }}</label>
            <div class="form-input">
                <select id="gender" v-model="profile.gender" :disabled="busy">
                    <option v-for="g in genderList" :key="g.id" :value="g.id">
                        {{ $t(g.name) }}
                    </option>
                </select>
                <button class="profile-edit-button" @click.prevent="activateField('gender')" :disabled="busy">
                    <font-awesome-icon icon="fa-solid fa-pen" />
                </button>
            </div>
        </span>
        <span class="form-item">
            <label class="form-label" for="age">{{ $t(l.profile_label_age) }}</label>
            <div class="form-input">
                <input id="age" type="number" v-model="profile.age" min="0" max="150" :readonly="busy" />
                <button class="profile-edit-button" @click.prevent="activateField('age')" :disabled="busy">
                    <font-awesome-icon icon="fa-solid fa-pen" />
                </button>
            </div>
        </span>
        <span class="form-item">
            <label class="form-label" for="language">{{ $t(l.profile_label_language) }}</label>
            <div class="form-input">
                <select id="language" v-model="profile.language" :disabled="busy">
                    <option v-for="loc in languages" :key="loc.lang" :value="loc.lang">
                        {{ loc.name }}
                    </option>
                </select>
                <button class="profile-edit-button" @click.prevent="activateField('language')" :disabled="busy">
                    <font-awesome-icon icon="fa-solid fa-pen" />
                </button>
            </div>
        </span>
        <span class="form-item">
            <label class="form-label" for="country">{{ $t(l.profile_label_country) }}</label>
            <div class="form-input">
                <input id="country" type="text" v-model="profile.country" autocomplete="country-name"
                    :readonly="busy" />
                <button class="profile-edit-button" @click.prevent="activateField('country')" :disabled="busy">
                    <font-awesome-icon icon="fa-solid fa-pen" />
                </button>
            </div>
        </span>
        <span class="form-item form-item-wide">
            <label class="form-label" for="bio">{{ $t(l.profile_label_bio) }}</label>
            <div class="form-input">
                <textarea id="bio" rows="4" cols="30" v-model="profile.bio" :readonly="busy"></textarea>
                <button class="profile-edit-button" @click.prevent="activateField('bio')" :disabled="busy">
                    <font-awesome-icon icon="fa-solid fa-pen" />
                </button>
            </div>
        </span>
        <div class="form-item error-message" v-if="error">
            {{ $t(error) }}
        </div>
        <div class="form-buttons">
            <template v-if="!busy">
                <input type="submit" :value="$t(l.profile_button_save)" />
            </template>
            <Spinner v-if="busy" />
        </div>
    </form>
</template>

<style scoped lang="scss">
.profile-form {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
    gap: 2rem;
}

.form-item {
    display: flex;
    flex-direction: column;
    flex-basis: calc(100% / 2 - 2rem);
}

.form-item-wide {
    flex-basis: 100%;
}

.form-input {
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    gap: 0.5rem;

    input,
    select,
    textarea {
        flex-grow: 1;
        width: 50%
    }
}

.form-buttons {
    display: flex;
    flex-direction: row;
    width: 100%;
    align-items: center;
    justify-content: center;
}

.profile-edit-button {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 2rem;
    height: 2rem;
    border-radius: 1rem;

    color: var(--text-color);
    background-color: var(--chat-bubble-background-color);
}

.error-message {
    color: var(--background-color);
    font-size: small;
    padding: 1rem;
    border: 1px solid var(--border-color);
    border-radius: 1rem;
    background-color: var(--error-color);
}

@media screen and (max-width: 600px) {
    .profile-form {
        flex-direction: column;
        flex-wrap: nowrap;
        align-items: stretch;
    }
}
</style>