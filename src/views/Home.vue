<script>
export default {
    name: "HomeView",
    props: {
        msg: String
    }
}
</script>

<template>
    <div id="home-view">
        <h2>Hello!</h2>
        <b>{{$route.query.text}}</b>
    </div>
</template>

<style scoped>
#home-view {
    padding: 1rem;
}
</style>
