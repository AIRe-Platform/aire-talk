// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at https://mozilla.org/MPL/2.0/.

<script setup lang="ts">
import { l } from '@/locales';
</script>

<template>
    <div class="profile-connections">
        <h3>{{ $t(l.profile_heading_connected_services) }}</h3>
        <div id="service-list">{{ $t(l.profile_empty_service_list) }}</div>
    </div>
</template>

<style lang="scss" scoped></style>