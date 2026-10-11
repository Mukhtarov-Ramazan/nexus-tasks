<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router';
import { ColumnFormModal } from '@/features/columnForm';
import { TaskDetails } from '@/features/taskDetails';
import {
  TaskFilters,
  countFilters,
  emptyFilters,
  matchesFilters,
  matchesSearch,
} from '@/features/taskFilters';
import { KanbanBoard } from '@/widgets/kanbanBoard';
import { ROUTES } from '@/shared/config';
import { readStorage, writeStorage } from '@/shared/lib/storage';
import type { KanbanColumn } from '@/shared/types/column';
import type { Task } from '@/shared/types/task';
import { useKanbanStore } from '@/stores/kanban';

const store = useKanbanStore();
const { columns, tasks, tasksByColumn } = storeToRefs(store);

// Фильтры: при активных показываем копии списков, перетаскивание отключено
const filters = ref(emptyFilters());
const search = ref('');
const filtersActive = computed(() => countFilters(filters.value) > 0 || !!search.value.trim());
const visibleTasksByColumn = computed(() =>
  filtersActive.value
    ? Object.fromEntries(
        Object.entries(tasksByColumn.value).map(([id, list]) => [
          id,
          list.filter(t => matchesFilters(t, filters.value) && matchesSearch(t, search.value)),
        ])
      )
    : tasksByColumn.value
);

// Вид доски: колонками или списком (запоминаем выбор)
type BoardView = 'columns' | 'list';
const VIEW_KEY = 'tasks-view';
const view = ref<BoardView>(readStorage<BoardView>(VIEW_KEY, 'columns'));
watch(view, value => writeStorage(VIEW_KEY, value));

const route = useRoute();
const router = useRouter();

const selectedId = computed(() => (route.params.taskId as string | undefined) ?? null);
const selectedTask = computed(() => tasks.value.find(t => t.id === selectedId.value) ?? null);

// Держим последнюю открытую задачу, чтобы контент не пропадал во время анимации закрытия
const shownTask = ref<Task | null>(null);
watch(selectedTask, task => task && (shownTask.value = task), { immediate: true });

const parentTask = computed(
  () => tasks.value.find(t => t.id === shownTask.value?.parentId) ?? null
);
const subtasks = computed(() => tasks.value.filter(t => t.parentId === shownTask.value?.id));

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
    <!-- mb-6: верх доски на уровне первого пункта сайдбара (низ блока переключателя = 24px, плюс gap-4) -->
    <div class="mb-6 flex min-h-10 items-center justify-between gap-3">
      <div class="flex items-center gap-2">
        <UFieldGroup>
          <UTooltip text="Колонками">
            <UButton
              icon="i-lucide-columns-3"
              :color="view === 'columns' ? 'secondary' : 'neutral'"
              :variant="view === 'columns' ? 'solid' : 'outline'"
              :class="{ 'text-white': view === 'columns' }"
              size="md"
              aria-label="Вид колонками"
              @click="view = 'columns'"
            />
          </UTooltip>
          <UTooltip text="Списком">
            <UButton
              icon="i-lucide-list"
              :color="view === 'list' ? 'secondary' : 'neutral'"
              :variant="view === 'list' ? 'solid' : 'outline'"
              :class="{ 'text-white': view === 'list' }"
              size="md"
              aria-label="Вид списком"
              @click="view = 'list'"
            />
          </UTooltip>
        </UFieldGroup>
        <UInput
          v-model="search"
          icon="i-lucide-search"
          placeholder="Поиск по названию или номеру"
          size="md"
          class="w-72"
          :ui="{ trailing: 'pe-1' }"
        >
          <template v-if="search" #trailing>
            <UButton
              icon="i-lucide-x"
              color="neutral"
              variant="link"
              size="sm"
              aria-label="Очистить поиск"
              @click="search = ''"
            />
          </template>
        </UInput>
        <TaskFilters v-model="filters" />
      </div>
      <UTooltip text="Создать колонку">
        <UButton
          icon="i-lucide-plus"
          color="neutral"
          variant="outline"
          size="md"
          aria-label="Создать колонку"
          @click="openCreate"
        />
      </UTooltip>
    </div>

    <div class="min-h-0 flex-1">
      <KanbanBoard
        v-model:columns="columns"
        :tasks-by-column="visibleTasksByColumn"
        :drag-disabled="filtersActive"
        :view="view"
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
      :parent="parentTask"
      :subtasks="subtasks"
      @update="store.updateTask"
      @create-subtask="store.addSubtask"
      @open-task="openTask"
    />
  </section>
</template>
