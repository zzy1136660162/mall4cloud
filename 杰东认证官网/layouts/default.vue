<script setup lang="ts">
import AppFooter from '~/components/home/AppFooter.vue';
import AppHeader from '~/components/home/AppHeader.vue';
import { homeData } from '~/data/home';
</script>

<template>
  <div class="min-h-screen bg-white">
    <AppHeader />
    <slot />
    <AppFooter :footer="homeData.footer" />
  </div>
</template>
