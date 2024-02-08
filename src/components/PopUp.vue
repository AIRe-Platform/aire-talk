<template>
    <div class="popup-overlay">
        <div class="popup-panel" @click.stop="">
            <slot></slot>
        </div>
    </div>
</template>

<style scoped>
.popup-overlay {
    position: absolute;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9001;

    display: flex;
    align-items: center;
    justify-content: center;

    background: var(--overlay-color);
}

.popup-panel {
    display: flex;
    border-radius: 1rem;
    border: 1px solid var(--border-color);
    box-shadow: 0 0 5px var(--shadow-color);
    background-color: var(--panel-background-color);
}
</style>
