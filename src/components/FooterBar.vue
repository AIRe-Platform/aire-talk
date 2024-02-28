<script setup lang="ts">
import version from "@/../version.json";
</script>

<template>
    <div id="footer-container">
        <div class="footer">
            <b>{{ $t("footer") }} - {{ version.hash }}{{ version.tag && ` - ${version.tag}` }}</b>
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

@media screen and (max-width: 600px) {
    .footer {
        width: 100%;
        justify-content: center;
    }
}
</style>
