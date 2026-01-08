<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import type { NavigationMenuItem, DropdownMenuItem} from '@nuxt/ui';

const route = useRoute();

const navItems = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Задачи',
    to: '/',
    active: route.path.startsWith('/'),
  },
  {
    label: 'Чат',
    to: '/chat',
    active: route.path.startsWith('/chat'),
  },
]);

const items = ref<DropdownMenuItem[][]>([
  [
    {
      label: 'Profile',
      icon: 'i-lucide-user',
    },
    {
      label: 'Billing',
      icon: 'i-lucide-credit-card',
    },
    {
      label: 'Settings',
      icon: 'i-lucide-cog',
    //   kbds: [','],
    },
  ],
  [
    {
      label: 'Logout',
      icon: 'i-lucide-log-out',
    //   kbds: ['shift', 'meta', 'q'],
    },
  ],
]);
</script>

<template>
  <div class="default-layout">
    <UHeader class="container">
      <template #title>
        <h1>NexusTasks</h1>
      </template>

      <UNavigationMenu :items="navItems" />

      <template #right>
        <UColorModeButton />

        <UDropdownMenu
          :items="items"
          :ui="{
            content: 'w-48',
          }"
        >
          <!-- <UButton icon="i-lucide-menu" color="neutral" variant="outline" /> -->
          <UAvatar alt="Mukhtarov Ramazan" />
        </UDropdownMenu>
      </template>
    </UHeader>
    <slot />
  </div>
</template>

<style scoped lang="scss">
:deep(.container) {
  max-width: 1920px;
  padding: 0 24px;
  margin: 0 auto;
}
</style>
