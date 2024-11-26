<!-- This Source Code Form is subject to the terms of the Mozilla Public
 License, v. 2.0. If a copy of the MPL was not distributed with this
 file, You can obtain one at https://mozilla.org/MPL/2.0/.
 -->


<script setup lang="ts">
</script>

<template>
    <div id="not-found-view">
        <div class="panel">
            <h1>{{ $t("not_found") }}</h1>
        </div>
    </div>
</template>

<style lang="scss" scoped>
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
