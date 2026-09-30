<script setup lang="ts">
import type { NavigationMenuItem, DropdownMenuItem } from '@nuxt/ui';
import { ROUTES } from '@/shared/config';

const navItems: NavigationMenuItem[] = [
  { label: 'Задачи', to: ROUTES.home },
  { label: 'Чат', to: ROUTES.messenger },
];

const userMenu: DropdownMenuItem[][] = [
  [
    { label: 'Профиль', icon: 'i-lucide-user' },
    { label: 'Оплата', icon: 'i-lucide-credit-card' },
    { label: 'Настройки', icon: 'i-lucide-cog' },
  ],
  [{ label: 'Выйти', icon: 'i-lucide-log-out' }],
];
</script>

<template>
  <div>
    <UHeader :ui="{ container: 'max-w-[1920px]' }">
      <template #title>
        <h1>NexusTasks</h1>
      </template>

      <UNavigationMenu :items="navItems" />

      <template #right>
        <UColorModeButton />

        <UDropdownMenu :items="userMenu" :ui="{ content: 'w-48' }">
          <UAvatar alt="Mukhtarov Ramazan" />
        </UDropdownMenu>
      </template>
    </UHeader>

    <UContainer>
      <UPage>
        <template #left>
          <UPageAside />
        </template>

        <slot />
      </UPage>
    </UContainer>
  </div>
</template>
