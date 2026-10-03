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
  assignees: TaskAssignee[];
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
