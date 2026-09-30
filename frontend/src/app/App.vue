<script setup lang="ts">
import { computed } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import { layouts } from '@/layouts';

const route = useRoute();

const currentLayout = computed(() => layouts[route.meta.layout ?? 'default']);
</script>

<template>
  <UApp>
    <component :is="currentLayout">
      <RouterView />
    </component>
  </UApp>
</template>
