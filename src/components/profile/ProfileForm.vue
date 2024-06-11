<script setup lang="ts">
import { reactive } from 'vue';
import { AireServices, AireUser } from "aire";
import { l } from '@/locales';
import Spinner from "@/components/Spinner.vue";
import ISO6391 from 'iso-639-1';
import useLogin from '@/context/login';

const login = useLogin();

const state = reactive<{
    busy: boolean,
    error?: string
}>({
    busy: false
});

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
}>(login.user || {});

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

    if (AireServices.ID && login.user) {
        state.busy = true;
        const data: AireUser = { ...login.user, ...profile };
        login.saveProfile(data)
            .then((result) => {
                if (result) {
                    Object.assign(profile, result);
                    state.error = undefined;
                } else {
                    state.error = l.error_profile_edit;
                }
            })
            .finally(() => (state.busy = false));
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
                    :readonly="state.busy" />
                <div class="icon edit" @click.prevent="activateField('first-name')" :disabled="state.busy">
                </div>
            </div>
        </span>
        <span class="form-item">
            <label class="form-label" for="last-name">{{ $t(l.profile_label_last_name) }}</label>
            <div class="form-input">
                <input id="last-name" type="text" v-model="profile.last_name" autocomplete="family-name"
                    :readonly="state.busy" />
                <div class="icon edit" @click.prevent="activateField('last-name')" :disabled="state.busy">
                </div>
            </div>
        </span>
        <span class="form-item">
            <label class="form-label" for="gender">{{ $t(l.profile_label_gender) }}</label>
            <div class="form-input">
                <select id="gender" v-model="profile.gender" :disabled="state.busy">
                    <option v-for="g in genderList" :key="g.id" :value="g.id">
                        {{ $t(g.name) }}
                    </option>
                </select>
                <div class="icon edit" @click.prevent="activateField('gender')" :disabled="state.busy">
                </div>
            </div>
        </span>
        <span class="form-item">
            <label class="form-label" for="age">{{ $t(l.profile_label_age) }}</label>
            <div class="form-input">
                <input id="age" type="number" v-model="profile.age" min="0" max="150" :readonly="state.busy" />
                <div class="icon edit" @click.prevent="activateField('age')" :disabled="state.busy">
                </div>
            </div>
        </span>
        <span class="form-item">
            <label class="form-label" for="language">{{ $t(l.profile_label_language) }}</label>
            <div class="form-input">
                <select id="language" v-model="profile.language" :disabled="state.busy">
                    <option v-for="loc in languages" :key="loc.lang" :value="loc.lang">
                        {{ loc.name }}
                    </option>
                </select>
                <div class="icon edit" @click.prevent="activateField('language')" :disabled="state.busy">
                </div>

            </div>
        </span>
        <span class="form-item">
            <label class="form-label" for="country">{{ $t(l.profile_label_country) }}</label>
            <div class="form-input">
                <input id="country" type="text" v-model="profile.country" autocomplete="country-name"
                    :readonly="state.busy" />
                <div class="icon edit" @click.prevent="activateField('country')" :disabled="state.busy">
                </div>
            </div>
        </span>
        <span class="form-item-wide">
            <label class="form-label" for="bio">{{ $t(l.profile_label_bio) }}</label>
            <div class="form-input-textarea">
                <textarea id="bio" rows="4" cols="84" v-model="profile.bio" :readonly="state.busy"></textarea>
                <div class="icon edit margin-left" @click.prevent="activateField('bio')" :disabled="state.busy">
                </div>
            </div>
        </span>
        <div class="form-item error-message" v-if="state.error">
            {{ $t(state.error) }}
        </div>
        <div class="form-buttons">
            <template v-if="!state.busy">
                <input type="submit" :value="$t(l.profile_button_save)" />
            </template>
            <Spinner v-if="state.busy" />
        </div>
    </form>
</template>

<style lang="scss" scoped>
.profile-form {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
    overflow: hidden;
    gap: 2rem;
}

.form-item {
    display: flex;
    flex-direction: row;
    flex-basis: calc(50% - 2rem);
    align-items: center;
    gap: 0.5rem;

    &>.form-label {
        flex-basis: 20%;
    }

    &>.form-input {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex-grow: 1;

        &>:first-child {
            width: 50%;
            flex-grow: 1;
        }
    }
}

.margin-left {
    margin-left: 0.5rem;
}

.form-item-wide {
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    flex-basis: 100%;
    gap: 0.5rem;

    &>.form-label {
        flex-basis: 10%;
    }

    .form-input-textarea {
        display: flex;
        flex-direction: row;
        flex-grow: 1;

        &>:first-child {
            width: 50%;
            flex-grow: 1;
        }
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
    font-size: var(--font-small);
    padding: 1rem;
    border: 1px solid var(--border-color);
    border-radius: 1rem;
    background-color: var(--error-color);
}

.ui-mode-mobile {
    .profile-form {
        flex-direction: column;
        flex-wrap: nowrap;
        align-items: stretch;
    }
}
</style>