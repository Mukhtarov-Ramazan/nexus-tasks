import type { TaskComplexity, TaskPriority, TaskType } from '@/shared/types/task';

export type BadgeColor = 'neutral' | 'info' | 'warning' | 'error' | 'success' | 'secondary';

export const priorityMap: Record<TaskPriority, { label: string; color: BadgeColor; icon: string }> =
  {
    low: { label: 'Низкий', color: 'neutral', icon: 'i-lucide-arrow-down' },
    medium: { label: 'Средний', color: 'info', icon: 'i-lucide-minus' },
    high: { label: 'Высокий', color: 'warning', icon: 'i-lucide-arrow-up' },
    critical: { label: 'Критичный', color: 'error', icon: 'i-lucide-flame' },
  };

export const complexityMap: Record<TaskComplexity, { label: string; color: BadgeColor }> = {
  easy: { label: 'Легкая', color: 'success' },
  medium: { label: 'Средняя', color: 'warning' },
  hard: { label: 'Сложная', color: 'error' },
};

export const typeMap: Record<TaskType, { label: string; color: BadgeColor; icon: string }> = {
  bug: { label: 'Баг', color: 'error', icon: 'i-lucide-bug' },
  feature: { label: 'Новый функционал', color: 'success', icon: 'i-lucide-sparkles' },
  improvement: { label: 'Улучшение', color: 'info', icon: 'i-lucide-trending-up' },
  chore: { label: 'Рутина', color: 'neutral', icon: 'i-lucide-wrench' },
};

/** Временный список сотрудников компании */
export const mockUsers = [
  { id: '1', fullName: 'Мухтаров Рамазан Ильясович' },
  { id: '2', fullName: 'Иванов Иван Иванович' },
  { id: '3', fullName: 'Петрова Анна Сергеевна' },
  { id: '4', fullName: 'Сидоров Алексей Петрович' },
  { id: '5', fullName: 'Кузнецова Мария Андреевна' },
];
