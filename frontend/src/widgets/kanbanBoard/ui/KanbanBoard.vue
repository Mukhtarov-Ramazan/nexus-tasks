<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus';
import type { KanbanColumn } from '@/shared/types/column';
import type { Task } from '@/shared/types/task';
import KanbanColumnView from './KanbanColumnView.vue';

const columns = defineModel<KanbanColumn[]>('columns', { required: true });
const tasksByColumn = defineModel<Record<string, Task[]>>('tasksByColumn', { required: true });
defineEmits<{
  editColumn: [id: string];
  deleteColumn: [id: string];
  addTask: [columnId: string];
  openTask: [id: string];
}>();
</script>

<template>
  <VueDraggable
    v-model="columns"
    group="columns"
    handle=".column-handle"
    :animation="200"
    ghost-class="opacity-40"
    class="flex h-full items-start gap-4 overflow-x-auto pb-2"
  >
    <KanbanColumnView
      v-for="column in columns"
      :key="column.id"
      :column="column"
      v-model:tasks="tasksByColumn[column.id]"
      @edit="$emit('editColumn', column.id)"
      @delete="$emit('deleteColumn', column.id)"
      @add-task="$emit('addTask', column.id)"
      @open-task="$emit('openTask', $event)"
    />
  </VueDraggable>
</template>
