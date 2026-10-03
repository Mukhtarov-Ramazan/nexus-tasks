<script setup lang="ts">
import { TaskCard } from '@/features/taskCard';
import type { Task } from '@/shared/types/task';

// Временные тестовые данные
const tasks: Task[] = [
  {
    id: 'NX-101',
    title: 'Исправить ошибку при сохранении профиля пользователя после смены пароля и повторной авторизации через почту',
    assignees: [
      { id: '1', fullName: 'Мухтаров Рамазан Ильясович' },
      { id: '2', fullName: 'Иванов Иван Иванович' },
    ],
    priority: 'critical',
    complexity: 'hard',
    dueDate: '2026-10-01',
    estimatedHours: 8,
    spentHours: 10,
    type: 'bug',
  },
  {
    id: 'NX-102',
    title: 'Добавить фильтр задач по исполнителю',
    assignees: [{ id: '3', fullName: 'Петрова Анна Сергеевна' }],
    priority: 'medium',
    complexity: 'easy',
    dueDate: '2026-11-15',
    estimatedHours: 12,
    spentHours: 3,
    type: 'feature',
  },
];
</script>

<template>
  <section>
    <h2 class="text-2xl font-semibold">Задачи</h2>

    <div class="mt-4 grid max-w-sm gap-3">
      <TaskCard v-for="task in tasks" :key="task.id" :task="task" />
    </div>
  </section>
</template>
