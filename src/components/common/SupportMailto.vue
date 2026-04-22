<script setup lang="ts">
import { l } from '@/locales';


</script>

<template>
    <div class="support-mailto">
        <p>{{ $t(l.about_support) }}</p>
        <a href="mailto:aire@jamk.fi">aire@jamk.fi</a>
    </div>
</template>

<style lang="css" scoped>
.support-mailto {
    display: flex;
    flex-direction: column;
}
</style>
