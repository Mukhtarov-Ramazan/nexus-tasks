<script setup lang="ts">
import { ref } from 'vue';
import { columnColors, defaultColumnColor } from '@/shared/config';
import type { KanbanColumn } from '@/shared/types/column';
import type { Task } from '@/shared/types/task';

const props = defineProps<{ subtasks: Task[]; columns: KanbanColumn[] }>();
const emit = defineEmits<{ create: [title: string]; open: [id: string] }>();

const adding = ref(false);
const draft = ref('');

const startAdding = () => {
  draft.value = '';
  adding.value = true;
};

const commit = () => {
  const title = draft.value.trim();
  if (title) emit('create', title);
  draft.value = '';
  adding.value = false;
};

const column = (status: string) => props.columns.find(c => c.id === status);
const dotClass = (status: string) =>
  (columnColors[column(status)?.color ?? ''] ?? columnColors[defaultColumnColor]).bg;
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-center justify-between">
      <span class="text-base font-semibold">Подзадачи</span>
      <UButton
        icon="i-lucide-list-plus"
        label="Добавить подзадачу"
        color="neutral"
        variant="outline"
        size="sm"
        @click="startAdding"
      />
    </div>

    <p v-if="!subtasks.length && !adding" class="text-sm text-muted">Подзадач пока нет</p>

    <ul v-if="subtasks.length" class="flex flex-col gap-1.5">
      <li v-for="sub in subtasks" :key="sub.id">
        <button
          type="button"
          class="flex w-full items-center gap-2 rounded-md border border-default px-3 py-2 text-left text-sm transition-colors hover:bg-elevated"
          @click="emit('open', sub.id)"
        >
          <span class="size-2 shrink-0 rounded-full" :class="dotClass(sub.status)" />
          <span class="shrink-0 text-xs text-muted">{{ sub.id }}</span>
          <span class="min-w-0 flex-1 truncate">{{ sub.title }}</span>
          <span class="shrink-0 text-xs text-muted">{{ column(sub.status)?.title }}</span>
        </button>
      </li>
    </ul>

    <UInput
      v-if="adding"
      v-model="draft"
      placeholder="Название подзадачи"
      autofocus
      @blur="commit"
      @keydown.enter.prevent="commit"
      @keydown.esc.prevent="adding = false"
    />
  </div>
</template>
