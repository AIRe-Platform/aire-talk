<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->

<script setup lang="ts">
import { reactive } from 'vue';
import { AireServices, AireUser } from "aire";
import { l } from '@/locales';
import useLogin from '@/context/login';
import Spinner from "@/components/common/Spinner.vue";
import DialogModal from '@/components/layout/DialogModal.vue';
import Tooltip from "@/components/common/Tooltip.vue";

const MAX_LENGTH_NAME = 50
const MAX_LENGTH_BIO = 2000

const currentYear = new Date().getFullYear();

// Set the maximum year as the current year and minimum year as 130 years ago 
const maxYear = currentYear;
const minYear = currentYear - 130;

const login = useLogin();

const remainingCharacters = (maxLength: number, numCharacters?: number) => {
    if (numCharacters)
        return maxLength - numCharacters;
    return maxLength;
}

const state = reactive<{
    busy: boolean,
    show_confirmation_modal: boolean,
    error?: string
}>({
    busy: false,
    show_confirmation_modal: false
});

const profile = reactive<{
    uuid?: string;
    first_name?: string;
    last_name?: string;
    gender?: "male" | "female" | "other";
    year_of_birth?: number;
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
            .finally(() => {
                state.busy = false;
                if (!state.error) {
                    state.show_confirmation_modal = true;
                }
            });
    }
};
</script>

<template>
    <DialogModal :active="state.show_confirmation_modal"
        @active="(isActive) => { state.show_confirmation_modal = isActive }"
        @focus-first-button="(btn: HTMLElement | null) => btn?.focus()" :buttons="[
            { loc_key: l.button_accept, onClick: () => { state.show_confirmation_modal = false; } },
        ]">
        {{ $t(l.popup_confirm_profile_updated) }}
    </DialogModal>

    <form class="profile-form" @submit.prevent="onSaveChanges">
        <span class="form-item baseline">
            <label class="form-label" for="first-name">{{ $t(l.profile_label_first_name) }}</label>
            <div class="form-input">
                <div class="input-column">
                    <input id="first-name" type="text" v-model="profile.first_name" autocomplete="given-name"
                        :readonly="state.busy" :maxlength=MAX_LENGTH_NAME />
                    <span class="max-length-message" v-if="profile.first_name?.length == MAX_LENGTH_NAME">{{
                        $t(l.profile_characters_max, [MAX_LENGTH_NAME]) }} </span>
                </div>
            </div>
        </span>
        <span class="form-item baseline">
            <label class="form-label" for="last-name">{{ $t(l.profile_label_last_name) }}</label>
            <div class="form-input">
                <div class="input-column">
                    <input id="last-name" type="text" v-model="profile.last_name" autocomplete="family-name"
                        :readonly="state.busy" :maxlength=MAX_LENGTH_NAME />
                    <span class="max-length-message" v-if="profile.last_name?.length == MAX_LENGTH_NAME">{{
                        $t(l.profile_characters_max, [MAX_LENGTH_NAME]) }} </span>
                </div>
            </div>
        </span>
        <span class="form-item">
            <label class="form-label" for="gender">{{ $t(l.profile_label_gender) }}</label>
            <div class="form-input">
                <select id="gender" v-model="profile.gender" :disabled="state.busy">
                    <option v-for=" g in genderList " :key="g.id" :value="g.id">
                        {{ $t(g.name) }}
                    </option>
                </select>
            </div>
        </span>
        <span class="form-item">
            <label class="form-label" for="year_of_birth">{{ $t(l.profile_label_year_of_birth) }}</label>
            <div class="form-input">
                <input id="year_of_birth" type="number" v-model="profile.year_of_birth" :min="minYear" :max="maxYear"
                    placeholder="e.g., 1990" :readonly="state.busy" required />
            </div>
        </span>
        <span class="form-item margin-top">
            <label class="form-label" for="country">{{ $t(l.profile_label_country) }}</label>
            <div class="form-input">
                <input id="country" type="text" v-model="profile.country" autocomplete="country-name"
                    :readonly="state.busy" />
            </div>
        </span>
        <span class="form-item-wide margin-top">
            <label class="form-label" for="bio">{{ $t(l.profile_label_bio) }}</label>
            <div class="form-input-textarea">
                <div class="input-column">
                    <textarea id="bio" v-model="profile.bio" :readonly="state.busy"
                        :maxlength=MAX_LENGTH_BIO></textarea>
                    <span> {{
                        remainingCharacters(MAX_LENGTH_BIO, profile.bio?.length) }} / {{ MAX_LENGTH_BIO }} {{
                            $t(l.profile_remaining) }}</span>
                </div>
            </div>
        </span>
        <div class="form-item error-message" v-if="state.error">
            {{ $t(state.error) }}
        </div>
        <div class="tooltip-unique-style">
            <Tooltip :text="$t(l.tooltip_save)" position="top" :useMaxContent="false" :adjustPosition="true">
                <div class="form-buttons">
                    <template v-if="!state.busy">
                        <button class="btn" type="submit">{{ $t(l.profile_button_save) }}</button>
                    </template>
                    <Spinner v-if="state.busy" />
                </div>
            </Tooltip>
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
    padding: 2rem;
}

.form-item {
    display: flex;
    flex-direction: row;
    flex-basis: calc(50% - 2rem);
    align-items: center;
    gap: 0.5rem;

    &>.form-label {
        flex-basis: 20%;
        font-size: var(--font-medium);
    }

    &>.form-input {
        display: flex;
        align-items: flex-start;
        gap: 0.5rem;
        flex-grow: 1;
        max-width: 100%;

        &>:first-child {
            width: 50%;
            flex-grow: 1;
        }
    }
}

.margin-top {
    margin-top: 2rem;
}

.input-column {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 3.5rem;
}

.baseline {
    align-items: baseline;
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
        font-size: var(--font-medium);
    }

    .form-input-textarea {
        display: flex;
        flex-direction: row;
        flex-grow: 1;
        max-width: 100%;

        & textarea {
            resize: none;
            height: 100%;
        }

        &>:first-child {
            width: 50%;
            flex-grow: 1;
            height: 7rem;
        }
    }
}

.tooltip-unique-style {
    display: flex;
    justify-content: center;
    padding: 1rem;
    margin-bottom: 1rem;
    margin-inline: auto;
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

@media screen and ((max-aspect-ratio: 1/1) or (max-width: 920px)) {
    .profile-form {
        flex-direction: column;
        flex-wrap: nowrap;
        align-items: stretch;
    }

    .form-item-wide>.form-label {
        flex-basis: 20%;
    }


    .input-column {
        height: auto;
        position: relative;

        &>.max-length-message {
            position: absolute;
            bottom: 0;
            transform: translateY(100%);
        }
    }

    .margin-top {
        margin-top: 0;
    }
}

@media screen and (max-width: 576px) {

    .form-item-wide,
    .form-item {
        flex-direction: column;
        align-items: stretch;
    }
}
</style>