<script>
    export default {
        name: "FooterBar"
    }
</script>

<template>
    <div id="footer">
        <b>{{ $t("footer") }}</b>
    </div>
</template>

<style scoped>
    #footer {
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
</style>