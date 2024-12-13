<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->


<script setup lang="ts">
import { l } from '@/locales';
import { reactive } from 'vue';

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
    <div class="about-view">
        <div class="about-menu">
            <h1>{{ $t(l.about_title) }}</h1>
            <div class="btn-container">
                <button type="button" class="btn" @click="toggleTermsModal">{{ $t(l.about_tou) }}</button>
                <button type="button" class="btn" @click="togglePrivacyModal">{{ $t(l.about_privacy_policies) }}</button>
                <button type="button" class="btn" @click="toggleAuthorsModal">{{ $t(l.about_authors) }}</button>
            </div>
            <div class="collab-container">
                <h2>{{ $t(l.about_collaboration) }}</h2>
                <div class="images-container">
                    <a href="https://www.goodlife.technology" target="_blank">
                        <img src="@/assets/images/GoodLife_Logo_white -2023.png" :alt="$t(l.about_goodlife_logo_alt)">
                    </a>
                    <a href="https://www.jamk.fi/fi" target="_blank">
                        <img src="@/assets/images/jamk_tunnus_valkoinen_nimella_suomi.png" :alt="$t(l.about_jamk_logo_alt)">
                    </a>
                </div>
            </div>
        </div>
        <div class="about-container" tabindex="0">
            <div class="about-subcontainer" v-if="state.termsOpen">
                <h2>{{ $t(l.about_tou) }}</h2>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
                    incididunt ut labore et dolore
                    magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
                    commodo
                    consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim
                    id est
                    laborum.
                </p>
            </div>
            <div class="about-subcontainer" v-else-if="state.privacyOpen">
                <h2>{{ $t(l.about_privacy_policies) }}</h2>
                <p>
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
                </p>
                <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Unde eveniet delectus nobis dolor optio repellat laboriosam vitae suscipit, autem est consectetur, sapiente sit. Alias delectus ea necessitatibus neque modi ratione!</p>
                <p>Laborum, veniam. Dolores in nobis dolorum iusto voluptates ipsam nesciunt dolorem ullam assumenda pariatur velit minus, enim, temporibus consequuntur a tenetur nostrum vel soluta magni necessitatibus magnam! Ea, perferendis tempore.</p>
                <p>Optio harum obcaecati facilis eos laborum fuga voluptates, quasi ipsam officia reprehenderit, dicta laudantium necessitatibus architecto unde accusantium. Voluptates hic, repellendus reiciendis culpa magnam fuga modi? Iste ducimus cumque quis.</p>
                <p>Corporis voluptates quaerat, sequi ullam aut enim! Delectus impedit inventore doloribus similique, dignissimos fuga laboriosam aperiam quisquam nobis ut fugiat repudiandae rem, totam molestias quaerat sequi id ad et autem?</p>
                <p>Suscipit ex sint qui doloribus cum minus obcaecati itaque. Corrupti hic voluptas officiis animi perferendis dolorum cumque nemo natus eveniet non sed ex nulla fuga omnis nobis sequi, molestias nihil?</p>
            </div>
            <div class="about-subcontainer" v-else-if="state.authorsOpen">
                <h2>{{ $t(l.about_authors) }}</h2>
                <p>
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
                </p>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.about-view {
    display: flex;
    width: 100%;
    height: 100%;
}

.about-menu {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    font-size: larger;
    padding-inline: 3rem;
    margin-block-start: 10rem;
    width: 20%;

    &>.btn-container {
        display: flex;
        flex-direction: column;
        gap: 2rem;
        margin-block-start: 2rem;
    }
}

.about-container {
    background-color: #47425E;
    border-left: 2px solid #2374AB;
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
}

.about-subcontainer {
    background-color: #FFF;
    color: black;
    width: 50%;
    flex-grow: 1;
    padding: 2rem;
    margin-block: 2rem;
}

.images-container {
    display: flex;

    a,
    img {
        width: 100%;
        height: auto;
    }
}

.collab-container {
    margin-block-start: auto;
}

@media screen and ((max-aspect-ratio: 1/1) or (max-width: 920px)) {
    .about-view {
        flex-direction: column;
    }

    .about-menu {
        margin-block-start: 0.5rem;
        height: auto;
        width: auto;
        padding: 0;

        &>h1 {
            text-align: end;
            margin-block-start: 0.5rem;
            margin-inline-end: 0.5rem;
        }

        &>.btn-container {
            flex-direction: row;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-block-start: 1.5rem;
            margin-inline: 0.5rem;

            &>.btn {
                flex: 1 1 5rem;
            }
        }
    }

    .about-container {
        font-size: var(--font-small);
        border-left: unset;
        border-top: 2px solid #2374AB;
        margin-block-start: 0.5rem;
    }

    .about-subcontainer {
        width: auto;
        margin-inline: 1rem;
    }

    .collab-container {
        display: none;
    }
}
</style>
