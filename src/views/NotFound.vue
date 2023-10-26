<script>
export default {
    name: "NotFoundView"
}
</script>

<template>
    <div id="not-found-view">
        <div class="panel">
            <h2>{{ $t("not_found") }}</h2>
        </div>
    </div>
</template>

<style scoped>
#not-found-view {
    display: flex;
    padding: 1rem;
    flex-grow: 1;
    align-items: center;
    justify-content: center;
}

.panel {
    display: block;
    padding: 2rem 3rem;
}
</style>
