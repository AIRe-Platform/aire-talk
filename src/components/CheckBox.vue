<script setup lang="ts">
import { defineComponent } from 'vue';
defineComponent({ name: "CheckBoxView" })
import { l } from '@/locales';

import { RouterLink } from 'vue-router';

</script>

<template>
    <h2>checkbox</h2>

    <button class="btn">
        <RouterLink class="nav-link" to="/">{{ $t(l.landing_view_form_button_cancel) }}</RouterLink>
    </button> 

</template>