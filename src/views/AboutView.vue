<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->


<script setup lang="ts">
import { l } from '@/locales';
import { router } from '@/router';
import { reactive } from 'vue';

const navigateTo = (path: string) => {
    router.push(path)
}

const state = reactive<{
    termsOpen: boolean,
    privacyOpen: boolean,
    authorsOpen: boolean,
}>({
    termsOpen: false,
    privacyOpen: false,
    authorsOpen: false,
});

const toggleTermsModal = () => {
    resetModals();
    state.termsOpen = true;
};

const togglePrivacyModal = () => {
    resetModals();
    state.privacyOpen = true;
};

const toggleAuthorsModal = () => {
    resetModals();
    state.authorsOpen = true;
};

const resetModals = () => {
    state.termsOpen = false;
    state.privacyOpen = false;
    state.authorsOpen = false;
}


</script>


<template>
    <div class="about-title">
        This is about page
        <button v-on:click="toggleTermsModal"> Terms of use </button>
        <button v-on:click="togglePrivacyModal"> Privacy policies</button>
        <button v-on:click="toggleAuthorsModal"> Authors </button>
    </div>

    <div class="about-container">
        <div class="about-subcontainer" v-if="state.termsOpen">

            <div>
                <h1>Terms of use</h1>
            </div>

            <div>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore
                magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                commodo
                consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim
                id est
                laborum.
            </div>
        </div>
        <div class="about-subcontainer" v-if="state.privacyOpen">
            <div>
                <h1>Privacy policies</h1>
            </div>
            <div>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore
                magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
                ea
                commodo
                consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla
                pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
                anim
                id est
                laborum.
            </div>
        </div>
        <div class="about-subcontainer" v-if="state.authorsOpen">
            <h1> Information about the authors</h1>
            <div>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                incididunt ut labore et dolore
                magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex
                ea
                commodo
                consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla
                pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
                anim
                id est
                laborum.
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
#about-view {
    width: 100%;
    height: 100%;
    background-image: url("@/assets/images/aire-bg-texture-3.png");

}

.about-title {
    display: flex;
    font-size: larger;
    padding: 3rem;
    margin: auto;
    gap: 2rem;
    width: 20%;
    height: 60%;
    flex-direction: column;
}

.about-container {
    margin: auto;
    width: 33%;
    height: 100%;
    background-color: #E3FFFA;
    border-left: 2px solid #A0BCB8;
    border-right: 2px solid #A0BCB8;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: black;
    justify-content: space-around;
    padding: 0rem 5rem;
}

.about-subcontainer {}

@media screen and ((max-aspect-ratio: 1/1) or (max-width: 920px)) {

    #about-view {
        background-size: cover;
    }

    .about-container {
        font-size: var(--font-small);
        width: 100%;
        height: 100%;
        background-color: unset;
        border-left: unset;
        border-right: unset;
    }

}
</style>