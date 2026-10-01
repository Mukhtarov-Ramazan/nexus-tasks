<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui';

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
  <UHeader class="shrink-0" :ui="{ container: 'max-w-none' }">
    <template #title>
      <h1 class="font-semibold text-indigo-500">NexusTasks</h1>
    </template>

    <template #right>
      <UColorModeButton />

      <UDropdownMenu :items="userMenu" :ui="{ content: 'w-48' }">
        <UAvatar alt="Mukhtarov Ramazan" />
      </UDropdownMenu>
    </template>
  </UHeader>
</template>
