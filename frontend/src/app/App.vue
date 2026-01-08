<script setup lang="ts">
  import { computed } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import AuthLayout from '@/layouts/AuthLayout.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';

const route = useRoute();

const currentLayout = computed(() => {
  return route.meta.layout || DefaultLayout;
});
</script>

<template>
  <UApp>
    <component :is="currentLayout">
      <RouterView />
    </component>
  </UApp>
</template>

<style></style>
