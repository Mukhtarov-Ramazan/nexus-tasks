import { computed, ref, watch } from 'vue';
import { defineStore } from 'pinia';
import { mockColumns, mockTasks } from '@/shared/config';
import type { KanbanColumn } from '@/shared/types/column';
import type { Task } from '@/shared/types/task';

export const useKanbanStore = defineStore('kanban', () => {
  const columns = ref<KanbanColumn[]>(structuredClone(mockColumns));

  // Задачи хранятся по колонкам: drag-and-drop правит эти массивы на месте
  const tasksByColumn = ref<Record<string, Task[]>>(
    Object.fromEntries(
      columns.value.map(c => [c.id, structuredClone(mockTasks.filter(t => t.status === c.id))])
    )
  );

  const tasks = computed(() => Object.values(tasksByColumn.value).flat());

  // Задача, перетащенная в другую колонку, получает её id в status
  watch(
    tasksByColumn,
    value => {
      for (const [columnId, list] of Object.entries(value)) {
        list.forEach(t => {
          if (t.status !== columnId) t.status = columnId;
        });
      }
    },
    { deep: true }
  );

  const addColumn = (data: Pick<KanbanColumn, 'title' | 'color'>) => {
    const id = crypto.randomUUID();
    columns.value.push({ id, ...data });
    tasksByColumn.value[id] = [];
  };

  const updateColumn = (id: string, data: Pick<KanbanColumn, 'title' | 'color'>) => {
    const column = columns.value.find(c => c.id === id);
    if (column) Object.assign(column, data);
  };

  /** Удаляет колонку вместе с её задачами */
  const removeColumn = (id: string) => {
    columns.value = columns.value.filter(c => c.id !== id);
    delete tasksByColumn.value[id];
  };

  const updateTask = (id: string, patch: Partial<Task>) => {
    const task = tasks.value.find(t => t.id === id);
    if (!task) return;
    // Смена статуса из деталки переносит задачу в другую колонку
    if (patch.status && patch.status !== task.status && tasksByColumn.value[patch.status]) {
      const from = tasksByColumn.value[task.status];
      from.splice(from.indexOf(task), 1);
      tasksByColumn.value[patch.status].push(task);
    }
    Object.assign(task, patch);
  };

  /** Создаёт подзадачу в той же колонке, что и родитель; на доске отображается как обычная задача */
  const addSubtask = (parentId: string, title: string) => {
    const parent = tasks.value.find(t => t.id === parentId);
    if (!parent || !tasksByColumn.value[parent.status]) return;
    const max = Math.max(0, ...tasks.value.map(t => Number(t.id.split('-')[1]) || 0));
    tasksByColumn.value[parent.status].push({
      id: `NX-${max + 1}`,
      title,
      parentId,
      status: parent.status,
      assignees: [],
      priority: 'medium',
      complexity: 'easy',
      dueDate: parent.dueDate,
      estimatedHours: 0,
      spentHours: 0,
      type: parent.type,
    });
  };

  return {
    columns,
    tasks,
    tasksByColumn,
    addColumn,
    updateColumn,
    removeColumn,
    updateTask,
    addSubtask,
  };
});
