import type { Task, TaskComplexity, TaskPriority, TaskType } from '@/shared/types/task';

export interface TaskFilters {
  types: TaskType[];
  assigneeIds: string[];
  priorities: TaskPriority[];
  complexities: TaskComplexity[];
  /** Только просроченные */
  overdue: boolean;
}

export const emptyFilters = (): TaskFilters => ({
  types: [],
  assigneeIds: [],
  priorities: [],
  complexities: [],
  overdue: false,
});

export const countFilters = (f: TaskFilters) =>
  f.types.length +
  f.assigneeIds.length +
  f.priorities.length +
  f.complexities.length +
  (f.overdue ? 1 : 0);

export const matchesFilters = (task: Task, f: TaskFilters) => {
  if (f.types.length && !f.types.includes(task.type)) return false;
  if (f.priorities.length && !f.priorities.includes(task.priority)) return false;
  if (f.complexities.length && !f.complexities.includes(task.complexity)) return false;
  if (f.assigneeIds.length && !task.assignees.some(a => f.assigneeIds.includes(a.id))) return false;
  if (f.overdue) {
    const isOverdue = new Date(task.dueDate).getTime() < Date.now() && task.status !== 'done';
    if (!isOverdue) return false;
  }
  return true;
};
