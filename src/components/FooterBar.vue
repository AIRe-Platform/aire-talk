<script setup lang="ts">
const version = {
    hash: import.meta.env.VITE_COMMIT_HASH,
    tag: import.meta.env.VITE_COMMIT_TAG
}
</script>

<template>
    <div id="footer-container">
        <div class="footer">
            <b>{{ $t("footer") }}{{ version.hash && ` - ${version.hash}` }}{{ version.tag && ` - ${version.tag}` }}</b>
        </div>
    </div>
</template>

<style scoped>
#footer-container {
    color: var(--footer-color);
    display: flex;
    flex-direction: row;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    z-index: 10;
    height: 1rem;
    font-size: xx-small;
}

.footer {
    display: flex;
    width: 25%;
    justify-content: space-evenly;
}

@media screen and ((max-aspect-ratio: 1/1) or (max-width: 920px)) {
    .footer {
        width: 100%;
        justify-content: center;
    }
}
</style>
