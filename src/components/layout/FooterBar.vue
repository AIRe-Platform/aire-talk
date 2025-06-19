<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->

<script setup lang="ts">
const version = {
    hash: import.meta.env.VITE_COMMIT_HASH,
    tag: import.meta.env.VITE_COMMIT_TAG
}
</script>

<template>
    <div id="footer-container">
        <footer class="footer">
            <b>{{ $t("footer") }}{{ version.hash && ` - ${version.hash}` }}{{ version.tag && ` - ${version.tag}` }}</b>
        </footer>
    </div>
</template>

<style lang="scss" scoped>
#footer-container {
    display: none;
    flex-direction: row;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    z-index: 10;
    height: 1rem;
    font-size: var(--font-small);
    color: var(--footer-text);
}

.footer {
    display: flex;
    justify-content: space-evenly;
}

@media screen and ((max-aspect-ratio: 1/1) or (max-width: 920px)) {
    .footer {
        width: 100%;
        justify-content: center;
    }
}
</style>
