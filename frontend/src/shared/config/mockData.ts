import type { KanbanColumn } from '@/shared/types/column';
import type { Task } from '@/shared/types/task';

/** Временный список сотрудников компании */
export const mockUsers = [
  { id: '1', fullName: 'Мухтаров Рамазан Ильясович' },
  { id: '2', fullName: 'Иванов Иван Иванович' },
  { id: '3', fullName: 'Петрова Анна Сергеевна' },
  { id: '4', fullName: 'Сидоров Алексей Петрович' },
  { id: '5', fullName: 'Кузнецова Мария Андреевна' },
];

/** Временные тестовые колонки */
export const mockColumns: KanbanColumn[] = [
  { id: 'backlog', title: 'Backlog', color: 'neutral' },
  { id: 'todo', title: 'К выполнению', color: 'info' },
  { id: 'in-progress', title: 'В работе', color: 'warning' },
  { id: 'review', title: 'На ревью', color: 'secondary' },
  { id: 'done', title: 'Готово', color: 'success' },
];

/** Временные тестовые задачи */
export const mockTasks: Task[] = [
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
