<script>
export default {
    name: "NavBar"
}
</script>

<template>
    <div id="nav-bar">
        <b>{{ $t("title") }}</b>
    </div>
</template>

<style scoped>
#nav-bar {
    display: flex;
    flex-direction: row;
    flex-shrink: 0;
    align-items: center;
    z-index: 10;
    height: 2rem;
    padding: 0.5rem;
}
</style>