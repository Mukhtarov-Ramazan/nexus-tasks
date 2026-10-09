<script setup lang="ts">
import { computed } from 'vue';
import { complexityMap, priorityMap, typeMap } from '@/shared/config';
import { formatHours } from '@/shared/lib/time';
import type { Task } from '@/shared/types/task';

const props = defineProps<{ task: Task }>();

const priority = computed(() => priorityMap[props.task.priority]);
const complexity = computed(() => complexityMap[props.task.complexity]);
const type = computed(() => typeMap[props.task.type]);

const badgeRows = computed(() => [
  { hint: 'Приоритет', rowIcon: 'i-lucide-flag', ...priority.value },
  { hint: 'Сложность', rowIcon: 'i-lucide-gauge', icon: undefined, ...complexity.value },
  { hint: 'Тип задачи', rowIcon: 'i-lucide-tag', ...type.value },
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
  <UCard :ui="{ body: 'p-3 sm:p-3 flex flex-col gap-2.5' }" class="w-full">
    <span class="text-xs text-muted">{{ task.id }}</span>

    <h3 class="line-clamp-2 text-sm font-semibold leading-snug" :title="task.title">
      {{ task.title }}
    </h3>

    <div class="flex flex-col gap-1.5">
      <div v-for="row in badgeRows" :key="row.hint" class="flex items-center gap-2">
        <UTooltip :text="row.hint">
          <UIcon :name="row.rowIcon" class="size-3.5 shrink-0 text-muted" />
        </UTooltip>
        <UBadge :color="row.color" :icon="row.icon" variant="subtle" size="sm">
          {{ row.label }}
        </UBadge>
      </div>

      <div class="flex items-center gap-2">
        <UTooltip text="Исполнители">
          <UIcon name="i-lucide-users" class="size-3.5 shrink-0 text-muted" />
        </UTooltip>
        <UAvatarGroup :max="4" size="xs">
          <UTooltip v-for="assignee in task.assignees" :key="assignee.id" :text="assignee.fullName">
            <UAvatar :src="assignee.avatarUrl" :alt="assignee.fullName" />
          </UTooltip>
        </UAvatarGroup>
      </div>
    </div>

    <div class="flex items-center justify-between text-xs text-muted">
      <UTooltip text="Дедлайн">
        <span class="flex items-center gap-1" :class="{ 'text-error': isOverdue }">
          <UIcon name="i-lucide-calendar" class="size-3.5" />
          {{ dueDateText }}
        </span>
      </UTooltip>
      <UTooltip text="Затрачено / выделено">
        <span class="flex items-center gap-1" :class="{ 'text-error': isOverspent }">
          <UIcon name="i-lucide-clock" class="size-3.5" />
          {{ formatHours(task.spentHours) }} / {{ formatHours(task.estimatedHours) }}
        </span>
      </UTooltip>
    </div>
  </UCard>
</template>
