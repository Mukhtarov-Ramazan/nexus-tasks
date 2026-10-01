<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { NavigationMenuItem, TabsItem } from '@nuxt/ui';
import { ROUTES } from '@/shared/config';

const route = useRoute();
const router = useRouter();

const sectionItems: TabsItem[] = [
  { label: 'Задачи', value: ROUTES.home },
  { label: 'Чат', value: ROUTES.messenger },
];

const section = computed({
  get: () => (route.path.startsWith(ROUTES.messenger) ? ROUTES.messenger : ROUTES.home),
  set: value => router.push(value),
});

// Временные тестовые пункты сайдбара
const sidebarItems: NavigationMenuItem[] = [
  { label: 'Все задачи', icon: 'i-lucide-list-checks' },
  { label: 'Мои задачи', icon: 'i-lucide-user-check' },
  { label: 'Проекты', icon: 'i-lucide-folder' },
  { label: 'Команда', icon: 'i-lucide-users' },
  { label: 'Архив', icon: 'i-lucide-archive' },
];
</script>

<template>
  <aside class="flex w-72 shrink-0 flex-col border-r border-default">
    <div class="shrink-0 border-b border-default p-4">
      <UTabs
        v-model="section"
        :items="sectionItems"
        :content="false"
        color="neutral"
        class="w-full"
        :ui="{
          indicator: 'bg-indigo-600',
          list: 'grid grid-flow-col auto-cols-fr',
          trigger: 'justify-center data-[state=active]:text-white',
        }"
      />
    </div>

    <div class="min-h-0 flex-1 overflow-y-auto p-4">
      <UNavigationMenu
        orientation="vertical"
        :items="sidebarItems"
        :ui="{ link: 'px-3 py-2.5 text-base', linkLeadingIcon: 'size-4' }"
      />
    </div>
  </aside>
</template>
