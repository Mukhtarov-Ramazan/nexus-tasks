<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { TaskCard } from '@/features/taskCard';
import { TaskDetails } from '@/features/taskDetails';
import { ROUTES } from '@/shared/config';
import type { Task } from '@/shared/types/task';

// Временные тестовые данные
const tasks = ref<Task[]>([
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
    status: 'В работе',
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
    status: 'Backlog',
  },
]);

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

const updateTask = (id: string, patch: Partial<Task>) => {
  const task = tasks.value.find(t => t.id === id);
  if (task) Object.assign(task, patch);
};
</script>

<template>
  <section>
    <h2 class="text-2xl font-semibold">Задачи</h2>

    <div class="mt-4 grid max-w-sm gap-3">
      <TaskCard
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        class="cursor-pointer"
        @click="openTask(task.id)"
      />
    </div>

    <TaskDetails v-model:open="isOpen" :task="shownTask" @update="updateTask" />
  </section>
</template>
