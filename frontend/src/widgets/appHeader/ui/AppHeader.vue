<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import type { DropdownMenuItem } from '@nuxt/ui';
import { ROUTES } from '@/shared/config';
import { formatClock } from '@/shared/lib/time';
import type { Task } from '@/shared/types/task';
import { useKanbanStore } from '@/stores/kanban';
import { useTimerStore } from '@/stores/timer';

const router = useRouter();
const kanban = useKanbanStore();
const timer = useTimerStore();

const activeTask = computed(() => kanban.tasks.find(t => t.id === timer.activeId) ?? null);

// Остановка из плашки сразу записывает время в задачу
const stopAndCommit = (task: Task) => {
  const total = timer.reset(task.id);
  if (total > 0) kanban.updateTask(task.id, { spentHours: task.spentHours + total / 3600 });
};

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
      <div
        v-if="activeTask"
        class="flex max-w-xs cursor-pointer items-center gap-2 rounded-md bg-indigo-500/10 py-1 pr-1 pl-3 text-sm hover:bg-indigo-500/20"
        role="button"
        tabindex="0"
        @click="router.push(`${ROUTES.tasks}/${activeTask.id}`)"
        @keydown.enter="router.push(`${ROUTES.tasks}/${activeTask.id}`)"
      >
        <span class="size-2 shrink-0 animate-pulse rounded-full bg-indigo-500" />
        <span class="truncate">{{ activeTask.id }} {{ activeTask.title }}</span>
        <span class="shrink-0 font-mono tabular-nums">
          {{ formatClock(timer.seconds(activeTask.id)) }}
        </span>
        <UTooltip text="Остановить и записать время">
          <UButton
            icon="i-lucide-pause"
            color="error"
            variant="soft"
            size="xs"
            aria-label="Остановить и записать время"
            @click.stop="stopAndCommit(activeTask)"
          />
        </UTooltip>
      </div>

      <UColorModeButton />

      <UDropdownMenu :items="userMenu" :ui="{ content: 'w-48' }">
        <UAvatar alt="Mukhtarov Ramazan" />
      </UDropdownMenu>
    </template>
  </UHeader>
</template>
