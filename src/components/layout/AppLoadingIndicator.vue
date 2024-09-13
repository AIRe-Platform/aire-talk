<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->

<script setup lang="ts">
</script>

<template>
    <div class="app-loading-indicator">
        <img class="app-loading-animation" src="@/assets/images/aire-splash-anim.gif" alt="Logo" />
    </div>
</template>

<style lang="scss">
.app-loading-indicator {
    display: flex;
    justify-content: center;
    align-items: center;

    margin: 1rem;
    height: 100%;

    border-radius: 1rem;
    background-color: white;
    box-shadow: 0 0 5px var(--shadow-color);
}

.app-loading-animation {
    margin: 1rem;
    width: 50vw;
    max-width: 256px;
    object-fit: contain;
}
</style>
