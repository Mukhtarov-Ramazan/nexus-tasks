<script setup lang="ts">
import { computed } from 'vue';
import { VueDraggable } from 'vue-draggable-plus';
import { TaskCard } from '@/features/taskCard';
import { columnColors, defaultColumnColor } from '@/shared/config';
import type { KanbanColumn } from '@/shared/types/column';
import type { Task } from '@/shared/types/task';

const props = defineProps<{ column: KanbanColumn }>();
const tasks = defineModel<Task[]>('tasks', { required: true });
const emit = defineEmits<{
  edit: [];
  delete: [];
  addTask: [];
  openTask: [id: string];
}>();

const color = computed(() => columnColors[props.column.color] ?? columnColors[defaultColumnColor]);

const headerButton = 'text-inherit hover:bg-white/20';
</script>

<template>
  <section class="flex max-h-full w-80 shrink-0 flex-col rounded-lg bg-muted">
    <header
      class="flex items-center gap-1 rounded-t-lg py-2 pr-2 pl-3"
      :class="[color.bg, color.text]"
    >
      <!-- За эту часть шапки таскаем колонку -->
      <div
        class="column-handle flex min-w-0 flex-1 cursor-grab items-center gap-2 active:cursor-grabbing"
      >
        <h3 class="truncate text-sm font-semibold" :title="column.title">{{ column.title }}</h3>
        <span class="rounded-full bg-white/25 px-2 text-xs font-medium">{{ tasks.length }}</span>
      </div>

      <UTooltip text="Добавить задачу">
        <UButton
          icon="i-lucide-plus"
          color="neutral"
          variant="ghost"
          size="xs"
          aria-label="Добавить задачу"
          :class="headerButton"
          @click="emit('addTask')"
        />
      </UTooltip>
      <UTooltip text="Редактировать">
        <UButton
          icon="i-lucide-pencil"
          color="neutral"
          variant="ghost"
          size="xs"
          aria-label="Редактировать колонку"
          :class="headerButton"
          @click="emit('edit')"
        />
      </UTooltip>
      <UTooltip text="Удалить">
        <UButton
          icon="i-lucide-trash-2"
          color="neutral"
          variant="ghost"
          size="xs"
          aria-label="Удалить колонку"
          :class="headerButton"
          @click="emit('delete')"
        />
      </UTooltip>
    </header>

    <VueDraggable
      v-model="tasks"
      group="tasks"
      :animation="150"
      ghost-class="opacity-40"
      class="flex min-h-24 flex-1 flex-col gap-2 overflow-y-auto p-2"
    >
      <TaskCard
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        class="shrink-0 cursor-pointer"
        @click="emit('openTask', task.id)"
      />
    </VueDraggable>
  </section>
</template>
