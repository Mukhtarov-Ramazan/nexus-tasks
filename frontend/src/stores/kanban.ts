import { computed, ref, watch } from 'vue';
import { defineStore } from 'pinia';
import type { KanbanColumn } from '@/shared/types/column';
import type { Task } from '@/shared/types/task';

export const useKanbanStore = defineStore('kanban', () => {
  // Временные тестовые данные
  const columns = ref<KanbanColumn[]>([
    { id: 'backlog', title: 'Backlog', color: 'neutral' },
    { id: 'todo', title: 'К выполнению', color: 'info' },
    { id: 'in-progress', title: 'В работе', color: 'warning' },
    { id: 'review', title: 'На ревью', color: 'secondary' },
    { id: 'done', title: 'Готово', color: 'success' },
  ]);

  const initialTasks: Task[] = [
    {
      id: 'NX-101',
      title:
        'Исправить ошибку при сохранении профиля пользователя после смены пароля и повторной авторизации через почту',
      assignees: [
        { id: '1', fullName: 'Мухтаров Рамазан Ильясович' },
        { id: '2', fullName: 'Иванов Иван Иванович' },
      ],
      watchers: [{ id: '4', fullName: 'Сидоров Алексей Петрович' }],
      priority: 'critical',
      complexity: 'hard',
      dueDate: '2026-10-01',
      estimatedHours: 8,
      spentHours: 10,
      type: 'bug',
      status: 'in-progress',
    },
    {
      id: 'NX-102',
      title: 'Добавить фильтр задач по исполнителю',
      assignees: [{ id: '3', fullName: 'Петрова Анна Сергеевна' }],
      watchers: [{ id: '1', fullName: 'Мухтаров Рамазан Ильясович' }],
      priority: 'medium',
      complexity: 'easy',
      dueDate: '2026-11-15',
      estimatedHours: 12,
      spentHours: 3,
      type: 'feature',
      status: 'backlog',
    },
    {
      id: 'NX-103',
      title: 'Настроить уведомления о приближении дедлайна',
      assignees: [{ id: '5', fullName: 'Кузнецова Мария Андреевна' }],
      priority: 'high',
      complexity: 'medium',
      dueDate: '2026-10-20',
      estimatedHours: 6,
      spentHours: 0,
      type: 'improvement',
      status: 'todo',
    },
    {
      id: 'NX-104',
      title: 'Обновить зависимости фронтенда',
      assignees: [{ id: '2', fullName: 'Иванов Иван Иванович' }],
      priority: 'low',
      complexity: 'easy',
      dueDate: '2026-12-01',
      estimatedHours: 2,
      spentHours: 1,
      type: 'chore',
      status: 'todo',
    },
    {
      id: 'NX-105',
      title: 'Реализовать загрузку файлов в описании задачи',
      assignees: [
        { id: '1', fullName: 'Мухтаров Рамазан Ильясович' },
        { id: '3', fullName: 'Петрова Анна Сергеевна' },
      ],
      priority: 'high',
      complexity: 'hard',
      dueDate: '2026-10-25',
      estimatedHours: 16,
      spentHours: 9,
      type: 'feature',
      status: 'review',
    },
    {
      id: 'NX-106',
      title: 'Исправить отображение карточек на узких экранах',
      assignees: [{ id: '4', fullName: 'Сидоров Алексей Петрович' }],
      priority: 'medium',
      complexity: 'medium',
      dueDate: '2026-09-28',
      estimatedHours: 4,
      spentHours: 4,
      type: 'bug',
      status: 'done',
    },
  ];

  // Задачи хранятся по колонкам: drag-and-drop правит эти массивы на месте
  const tasksByColumn = ref<Record<string, Task[]>>(
    Object.fromEntries(columns.value.map(c => [c.id, initialTasks.filter(t => t.status === c.id)]))
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

  return { columns, tasks, tasksByColumn, addColumn, updateColumn, removeColumn, updateTask };
});
