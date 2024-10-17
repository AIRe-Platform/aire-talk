<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->


<script setup lang="ts">
import { l } from '@/locales';
import { router } from '@/router';

const navigateTo = (path: string) => {
    router.push(path)
}

</script>

<template>
    <div class="about-title">
        This is about page
    </div>

    <div class="about-container">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
        incididunt ut labore et dolore
        magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
        consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est
        laborum.
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
    padding: 2rem;
    margin: auto;
    width: 12%;
    height: 60%;
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