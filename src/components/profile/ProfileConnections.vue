<script setup lang="ts">
import { l } from '@/locales';
</script>

<template>
    <div class="profile-connections">
        <h3>{{ $t(l.profile_heading_connected_services) }}</h3>
        <div id="service-list">{{ $t(l.profile_empty_service_list) }}</div>
    </div>
</template>

<style scoped></style>