<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router';
import { ColumnFormModal } from '@/features/columnForm';
import { TaskDetails } from '@/features/taskDetails';
import { KanbanBoard } from '@/widgets/kanbanBoard';
import { ROUTES } from '@/shared/config';
import type { KanbanColumn } from '@/shared/types/column';
import type { Task } from '@/shared/types/task';
import { useKanbanStore } from '@/stores/kanban';

const store = useKanbanStore();
const { columns, tasks, tasksByColumn } = storeToRefs(store);

const route = useRoute();
const router = useRouter();

const selectedId = computed(() => (route.params.taskId as string | undefined) ?? null);
const selectedTask = computed(() => tasks.value.find(t => t.id === selectedId.value) ?? null);

// Держим последнюю открытую задачу, чтобы контент не пропадал во время анимации закрытия
const shownTask = ref<Task | null>(null);
watch(selectedTask, task => task && (shownTask.value = task), { immediate: true });

const isOpen = computed({
  get: () => !!selectedTask.value,
  set: value => {
    if (!value) router.push(ROUTES.tasks);
  },
});

const openTask = (id: string) => router.push(`${ROUTES.tasks}/${id}`);

// Создание / редактирование колонки
const formOpen = ref(false);
const editingColumn = ref<KanbanColumn | null>(null);

const openCreate = () => {
  editingColumn.value = null;
  formOpen.value = true;
};

const openEdit = (id: string) => {
  editingColumn.value = columns.value.find(c => c.id === id) ?? null;
  formOpen.value = true;
};

const submitColumn = (data: Pick<KanbanColumn, 'title' | 'color'>) => {
  if (editingColumn.value) store.updateColumn(editingColumn.value.id, data);
  else store.addColumn(data);
};

// Удаление колонки с подтверждением
const deletingColumn = ref<KanbanColumn | null>(null);
const deleteOpen = computed({
  get: () => !!deletingColumn.value,
  set: value => {
    if (!value) deletingColumn.value = null;
  },
});
const deletingTasksCount = computed(
  () => tasksByColumn.value[deletingColumn.value?.id ?? '']?.length ?? 0
);

const confirmDelete = () => {
  if (deletingColumn.value) store.removeColumn(deletingColumn.value.id);
  deletingColumn.value = null;
};
</script>

<template>
  <section class="flex h-full flex-col gap-4">
    <div class="flex items-center justify-between gap-3">
      <h2 class="text-2xl font-semibold">Задачи</h2>
      <UTooltip text="Создать колонку">
        <UButton
          icon="i-lucide-plus"
          color="neutral"
          variant="outline"
          size="sm"
          aria-label="Создать колонку"
          @click="openCreate"
        />
      </UTooltip>
    </div>

    <div class="min-h-0 flex-1">
      <KanbanBoard
        v-model:columns="columns"
        v-model:tasks-by-column="tasksByColumn"
        @edit-column="openEdit"
        @delete-column="deletingColumn = columns.find(c => c.id === $event) ?? null"
        @open-task="openTask"
      />
    </div>

    <ColumnFormModal v-model:open="formOpen" :column="editingColumn" @submit="submitColumn" />

    <UModal
      v-model:open="deleteOpen"
      title="Удалить колонку?"
      :description="
        deletingTasksCount
          ? `Колонка «${deletingColumn?.title}» и все её задачи (${deletingTasksCount}) будут удалены.`
          : `Колонка «${deletingColumn?.title}» будет удалена.`
      "
    >
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton color="neutral" variant="outline" @click="deleteOpen = false">Отмена</UButton>
          <UButton color="error" @click="confirmDelete">Удалить</UButton>
        </div>
      </template>
    </UModal>

    <TaskDetails
      v-model:open="isOpen"
      :task="shownTask"
      :columns="columns"
      @update="store.updateTask"
    />
  </section>
</template>
