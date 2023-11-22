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
    justify-content: space-between;
    align-items: center;
    z-index: 10;
    height: 2rem;
    padding: 0.5rem;
    box-shadow: 0 0 5px var(--shadow-color);
}

#nav-title {
    padding: 1rem;
    font-weight: bold;
}

.nav-link {
    padding: 1rem;
}
</style>
