<script setup lang="ts">
import { computed } from 'vue';
import { complexityMap, priorityMap, typeMap } from '@/shared/config';
import { formatHours } from '@/shared/lib/time';
import type { Task } from '@/shared/types/task';

const props = defineProps<{ task: Task }>();

const badges = computed(() => [
  { hint: 'Тип задачи', ...typeMap[props.task.type] },
  { hint: 'Приоритет', ...priorityMap[props.task.priority] },
  { hint: 'Сложность', icon: undefined, ...complexityMap[props.task.complexity] },
]);

const dueDateText = computed(() =>
  new Date(props.task.dueDate).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
);

const isOverdue = computed(() => new Date(props.task.dueDate).getTime() < Date.now());
const isOverspent = computed(() => props.task.spentHours > props.task.estimatedHours);
</script>

<template>
  <div
    class="flex w-full items-center gap-3 rounded-md border border-default bg-default px-3 py-2 text-sm transition-colors hover:bg-elevated"
  >
    <span class="w-16 shrink-0 text-xs text-muted">{{ task.id }}</span>
    <span class="min-w-0 flex-1 truncate font-medium" :title="task.title">{{ task.title }}</span>

    <div class="hidden shrink-0 items-center gap-1.5 md:flex">
      <UTooltip v-for="badge in badges" :key="badge.hint" :text="badge.hint">
        <UBadge :color="badge.color" :icon="badge.icon" variant="subtle" size="sm">
          {{ badge.label }}
        </UBadge>
      </UTooltip>
    </div>

    <UAvatarGroup :max="3" size="xs" class="hidden shrink-0 sm:flex">
      <UTooltip v-for="assignee in task.assignees" :key="assignee.id" :text="assignee.fullName">
        <UAvatar :src="assignee.avatarUrl" :alt="assignee.fullName" />
      </UTooltip>
    </UAvatarGroup>

    <UTooltip text="Дедлайн">
      <span
        class="hidden w-28 shrink-0 items-center gap-1 text-xs text-muted lg:flex"
        :class="{ 'text-error': isOverdue }"
      >
        <UIcon name="i-lucide-calendar" class="size-3.5" />
        {{ dueDateText }}
      </span>
    </UTooltip>
    <UTooltip text="Затрачено / выделено">
      <span
        class="hidden w-24 shrink-0 items-center gap-1 text-xs text-muted lg:flex"
        :class="{ 'text-error': isOverspent }"
      >
        <UIcon name="i-lucide-clock" class="size-3.5" />
        {{ formatHours(task.spentHours) }} / {{ formatHours(task.estimatedHours) }}
      </span>
    </UTooltip>
  </div>
</template>
