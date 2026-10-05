export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type TaskComplexity = 'easy' | 'medium' | 'hard';
export type TaskType = 'bug' | 'feature' | 'improvement' | 'chore';

export interface TaskAssignee {
  id: string;
  fullName: string;
  avatarUrl?: string;
}

export interface Task {
  id: string;
  title: string;
  /** Описание в формате markdown */
  description?: string;
  /** Название колонки канбан-доски */
  status: string;
  files?: TaskFile[];
  assignees: TaskAssignee[];
  /** Наблюдатели; по умолчанию — автор задачи */
  watchers?: TaskAssignee[];
  priority: TaskPriority;
  complexity: TaskComplexity;
  /** ISO-дата дедлайна */
  dueDate: string;
  /** Выделено часов */
  estimatedHours: number;
  /** Затрачено часов */
  spentHours: number;
  type: TaskType;
}

export interface TaskFile {
  id: string;
  name: string;
  /** Размер в байтах */
  size: number;
  mimeType: string;
  /** Пока нет бэкенда — blob-URL, живёт до перезагрузки страницы */
  url: string;
}
