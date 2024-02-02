<script>
import { defineComponent } from 'vue';
defineComponent({ name: "PopUp.vue" })
export default {
    name: "PopUp"
}
</script>

<template>
    <div class="popup">
        <div class="popup-inner">
            <slot />
        </div>
    </div>
</template>

<style scoped>
.popup {
    position: absolute;
    background-color: var(--panel-background-color);
    left: 40%;
    top: 30%;
    width: 20rem;
    height: 15rem;
    align-self: center;
    margin: 0 3rem;
    box-shadow: 0 0 5px gray;
    line-height: 1.4rem;
    border-radius: 10px;
    border: 1px solid transparent;
    z-index: 2;
}

.popup-inner {
    display: flex;
}
</style>
