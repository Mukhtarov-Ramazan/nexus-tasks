<script setup lang="ts">
import { computed } from 'vue';
import type { Task, TaskComplexity, TaskPriority, TaskType } from '@/shared/types/task';

type BadgeColor = 'neutral' | 'info' | 'warning' | 'error' | 'success' | 'secondary';

const props = defineProps<{ task: Task }>();

const priorityMap: Record<TaskPriority, { label: string; color: BadgeColor; icon: string }> = {
  low: { label: 'Низкий', color: 'neutral', icon: 'i-lucide-arrow-down' },
  medium: { label: 'Средний', color: 'info', icon: 'i-lucide-minus' },
  high: { label: 'Высокий', color: 'warning', icon: 'i-lucide-arrow-up' },
  critical: { label: 'Критичный', color: 'error', icon: 'i-lucide-flame' },
};

const complexityMap: Record<TaskComplexity, { label: string; color: BadgeColor }> = {
  easy: { label: 'Легкая', color: 'success' },
  medium: { label: 'Средняя', color: 'warning' },
  hard: { label: 'Сложная', color: 'error' },
};

const typeMap: Record<TaskType, { label: string; color: BadgeColor; icon: string }> = {
  bug: { label: 'Баг', color: 'error', icon: 'i-lucide-bug' },
  feature: { label: 'Новый функционал', color: 'success', icon: 'i-lucide-sparkles' },
  improvement: { label: 'Улучшение', color: 'info', icon: 'i-lucide-trending-up' },
  chore: { label: 'Рутина', color: 'neutral', icon: 'i-lucide-wrench' },
};

const priority = computed(() => priorityMap[props.task.priority]);
const complexity = computed(() => complexityMap[props.task.complexity]);
const type = computed(() => typeMap[props.task.type]);

const dueDateText = computed(() =>
  new Date(props.task.dueDate).toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }),
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

    <UAvatarGroup :max="4" size="xs">
      <UTooltip v-for="assignee in task.assignees" :key="assignee.id" :text="assignee.fullName">
        <UAvatar :src="assignee.avatarUrl" :alt="assignee.fullName" />
      </UTooltip>
    </UAvatarGroup>

    <div class="flex flex-wrap items-center gap-1.5">
      <UBadge :color="priority.color" :icon="priority.icon" variant="subtle" size="sm">
        {{ priority.label }}
      </UBadge>
      <UBadge :color="complexity.color" variant="outline" size="sm">
        {{ complexity.label }}
      </UBadge>
      <UBadge :color="type.color" :icon="type.icon" variant="soft" size="sm">
        {{ type.label }}
      </UBadge>
    </div>

    <div class="flex items-center justify-between text-xs text-muted">
      <span class="flex items-center gap-1" :class="{ 'text-error': isOverdue }">
        <UIcon name="i-lucide-calendar" class="size-3.5" />
        {{ dueDateText }}
      </span>
      <span class="flex items-center gap-1" :class="{ 'text-error': isOverspent }">
        <UIcon name="i-lucide-clock" class="size-3.5" />
        {{ task.spentHours }} / {{ task.estimatedHours }} ч
      </span>
    </div>
  </UCard>
</template>
