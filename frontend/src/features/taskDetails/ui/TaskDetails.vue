<script setup lang="ts">
import { computed, ref } from 'vue';
import { useToast } from '@nuxt/ui/composables';
import {
  columnColors,
  complexityMap,
  defaultColumnColor,
  mockUsers,
  priorityMap,
  ROUTES,
  typeMap,
} from '@/shared/config';
import { formatHours } from '@/shared/lib/time';
import type { KanbanColumn } from '@/shared/types/column';
import type { Task, TaskFile } from '@/shared/types/task';
import TaskDescriptionEditor from './TaskDescriptionEditor.vue';
import TaskBadgeSelect from './TaskBadgeSelect.vue';
import TaskDeadline from './TaskDeadline.vue';
import TaskFiles from './TaskFiles.vue';
import TaskTimer from './TaskTimer.vue';

const props = defineProps<{ task: Task | null; columns: KanbanColumn[] }>();
const open = defineModel<boolean>('open', { default: false });
const emit = defineEmits<{ update: [id: string, patch: Partial<Task>] }>();

const expanded = ref(false);

const editingTitle = ref(false);
const titleDraft = ref('');

const startTitleEdit = () => {
  titleDraft.value = props.task?.title ?? '';
  editingTitle.value = true;
};

const commitTitle = () => {
  const value = titleDraft.value.trim();
  if (editingTitle.value && value && value !== props.task?.title) patch({ title: value });
  editingTitle.value = false;
};

const toast = useToast();

const copy = async (write: () => Promise<void>) => {
  try {
    await write();
    toast.add({ title: 'Скопировано', icon: 'i-lucide-check', color: 'success' });
  } catch {
    toast.add({ title: 'Не удалось скопировать', color: 'error' });
  }
};

const titleWithId = () => `${props.task?.id} ${props.task?.title}`;

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// Название-гиперссылка: text/html для документов и чатов, text/plain (ссылка) как запасной вариант
const writeTitleLink = () => {
  const { id } = props.task!;
  const url = `${window.location.origin}${ROUTES.tasks}/${id}`;
  const label = titleWithId();
  const html = `<a href="${escapeHtml(url)}">${escapeHtml(label)}</a>`;
  return navigator.clipboard.write([
    new ClipboardItem({
      'text/html': new Blob([html], { type: 'text/html' }),
      'text/plain': new Blob([`${label} ${url}`], { type: 'text/plain' }),
    }),
  ]);
};

const titleMenuItems = computed(() => [
  {
    label: 'Скопировать название',
    icon: 'i-lucide-copy',
    onSelect: () => copy(() => navigator.clipboard.writeText(titleWithId())),
  },
  {
    label: 'Скопировать название и ссылку',
    icon: 'i-lucide-link',
    onSelect: () => copy(writeTitleLink),
  },
  { label: 'Редактировать', icon: 'i-lucide-pencil', onSelect: startTitleEdit },
]);

const patch = (value: Partial<Task>) => {
  if (props.task) emit('update', props.task.id, value);
};

// Статусы — колонки доски; цвет колонки показываем точкой
const statusOptions = computed(() =>
  Object.fromEntries(
    props.columns.map(c => [
      c.id,
      {
        label: c.title,
        color: 'neutral' as const,
        dot: (columnColors[c.color] ?? columnColors[defaultColumnColor]).bg,
      },
    ])
  )
);

const selectFields = computed(
  () =>
    [
      { key: 'status', title: 'Статус', options: statusOptions.value, variant: 'subtle' },
      { key: 'priority', title: 'Приоритет', options: priorityMap, variant: 'subtle' },
      { key: 'complexity', title: 'Сложность', options: complexityMap, variant: 'subtle' },
      { key: 'type', title: 'Тип', options: typeMap, variant: 'subtle' },
    ] as const
);

type PeopleField = 'assignees' | 'watchers';

const peopleSections: { field: PeopleField; title: string; placeholder: string; remove: string }[] =
  [
    {
      field: 'assignees',
      title: 'Исполнители',
      placeholder: 'Добавить исполнителя',
      remove: 'Убрать исполнителя',
    },
    {
      field: 'watchers',
      title: 'Наблюдатели',
      placeholder: 'Добавить наблюдателя',
      remove: 'Убрать наблюдателя',
    },
  ];

const peopleOf = (field: PeopleField) => props.task?.[field] ?? [];

const availableUsers = (field: PeopleField) =>
  mockUsers
    .filter(u => !peopleOf(field).some(p => p.id === u.id))
    .map(u => ({ value: u.id, label: u.fullName, avatar: { alt: u.fullName } }));

const addFiles = (files: TaskFile[]) => {
  if (props.task) patch({ files: [...(props.task.files ?? []), ...files] });
};

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Удалённые файлы (url → файл): если изображение вернули через Ctrl+Z, файл возвращается в список
const removedFiles = new Map<string, TaskFile>();

const removeFile = (id: string) => {
  const file = props.task?.files?.find(f => f.id === id);
  if (!props.task || !file) return;
  removedFiles.set(file.url, file);
  // Вместе с файлом убираем его изображения из описания
  const image = new RegExp(`!\\[[^\\]]*\\]\\(${escapeRegExp(file.url)}[^)]*\\)\\n*`, 'g');
  patch({
    files: props.task.files?.filter(f => f.id !== id),
    description: (props.task.description ?? '').replace(image, ''),
  });
};

// Изображение, удалённое из описания, пропадает и из файлов; вернулось в описание — вернулось и в файлы
const updateDescription = (value: string) => {
  if (!props.task) return;
  const previous = props.task.description ?? '';
  const files = props.task.files ?? [];

  const orphaned = files.filter(f => previous.includes(f.url) && !value.includes(f.url));
  orphaned.forEach(f => removedFiles.set(f.url, f));

  const restored = [...removedFiles.values()].filter(
    f => value.includes(f.url) && !files.some(existing => existing.id === f.id)
  );
  restored.forEach(f => removedFiles.delete(f.url));

  if (!orphaned.length && !restored.length) return patch({ description: value });
  patch({
    description: value,
    files: [...files.filter(f => !orphaned.includes(f)), ...restored],
  });
};

const addPerson = (field: PeopleField, id: string | null) => {
  const user = mockUsers.find(u => u.id === id);
  if (user && props.task) patch({ [field]: [...peopleOf(field), user] });
};

const removePerson = (field: PeopleField, id: string) => {
  if (props.task) patch({ [field]: peopleOf(field).filter(p => p.id !== id) });
};

const isOverdue = computed(
  () => !!props.task && new Date(props.task.dueDate).getTime() < Date.now()
);
const isOverspent = computed(
  () => !!props.task && props.task.spentHours > props.task.estimatedHours
);
</script>

<template>
  <USlideover
    v-model:open="open"
    side="right"
    :title="task?.id"
    :description="task?.title"
    :ui="{
      content: expanded ? 'w-screen max-w-none' : 'w-[45vw] max-w-none min-w-[32rem]',
      body: 'flex flex-col overflow-hidden p-0 sm:p-0',
      wrapper: 'min-w-0 flex-1',
      description: 'mt-1 text-xl font-semibold leading-snug text-default',
    }"
  >
    <template #title>
      <span class="flex items-center gap-2">
        <UButton
          :icon="expanded ? 'i-lucide-minimize-2' : 'i-lucide-maximize-2'"
          color="neutral"
          variant="ghost"
          size="xs"
          :aria-label="expanded ? 'Свернуть' : 'Развернуть на всю ширину'"
          @click="expanded = !expanded"
        />
        {{ task?.id }}
      </span>
    </template>

    <template #description>
      <span class="group flex max-w-[90%] items-start gap-2">
        <UTextarea
          v-if="editingTitle"
          v-model="titleDraft"
          :rows="1"
          autoresize
          variant="none"
          autofocus
          class="w-full"
          :ui="{
            base: 'rounded-md border border-default px-2 py-1 text-xl font-semibold leading-snug transition-colors focus:border-accented',
          }"
          @blur="commitTitle"
          @keydown.enter.prevent="commitTitle"
          @keydown.esc.prevent="editingTitle = false"
        />
        <template v-else>
          <span class="min-w-0">{{ task?.title }}</span>
          <UDropdownMenu :items="titleMenuItems" :content="{ align: 'start' }">
            <UButton
              icon="i-lucide-ellipsis"
              color="neutral"
              variant="ghost"
              size="xs"
              aria-label="Действия с названием"
              class="shrink-0"
            />
          </UDropdownMenu>
        </template>
      </span>
    </template>
    <template #body>
      <div
        v-if="task"
        class="grid min-h-0 flex-1 grid-rows-1 grid-cols-[minmax(0,75fr)_minmax(14rem,25fr)]"
      >
        <!-- Основная часть -->
        <div class="flex min-w-0 flex-col gap-4 overflow-y-auto p-4 sm:p-6">
          <TaskDescriptionEditor
            :key="task.id"
            :model-value="task.description ?? ''"
            @update:model-value="updateDescription"
            @files-added="addFiles"
          />

          <TaskFiles
            class="shrink-0"
            :files="task.files ?? []"
            @add="addFiles"
            @remove="removeFile"
          />
        </div>

        <!-- Сайдбар -->
        <aside
          class="flex min-w-0 flex-col gap-4 overflow-y-auto border-l border-default p-4 sm:p-6"
        >
          <div v-for="field in selectFields" :key="field.key" class="flex flex-col gap-1.5">
            <span class="text-xs text-muted">{{ field.title }}</span>
            <TaskBadgeSelect
              :model-value="task[field.key]"
              :options="field.options"
              :variant="field.variant"
              @update:model-value="patch({ [field.key]: $event })"
            />
          </div>

          <div class="flex flex-col gap-1.5">
            <span class="text-xs text-muted">Дедлайн</span>
            <TaskDeadline
              :model-value="task.dueDate"
              :overdue="isOverdue"
              @update:model-value="patch({ dueDate: $event })"
            />
          </div>

          <div class="flex flex-col gap-3 border-t border-default pt-4">
            <div class="flex flex-col gap-1.5">
              <span class="text-xs text-muted">Выделено (ч)</span>
              <UInputNumber
                :model-value="task.estimatedHours"
                :min="0"
                :step="0.5"
                class="w-full"
                @update:model-value="patch({ estimatedHours: $event ?? 0 })"
              />
            </div>

            <div class="flex items-center justify-between text-sm">
              <span class="text-xs text-muted">Затрачено</span>
              <span class="font-medium" :class="{ 'text-error': isOverspent }">
                {{ formatHours(task.spentHours) }}
              </span>
            </div>

            <TaskTimer :key="task.id" :task-id="task.id" @add="patch({ spentHours: task.spentHours + $event })" />
          </div>

          <div
            v-for="section in peopleSections"
            :key="section.field"
            class="flex flex-col gap-2 border-t border-default pt-4"
          >
            <span class="text-xs text-muted">{{ section.title }}</span>

            <ul class="flex flex-col gap-1.5">
              <li
                v-for="person in peopleOf(section.field)"
                :key="person.id"
                class="flex items-center gap-2"
              >
                <UAvatar :src="person.avatarUrl" :alt="person.fullName" size="xs" />
                <span class="min-w-0 flex-1 truncate text-sm" :title="person.fullName">
                  {{ person.fullName }}
                </span>
                <UButton
                  icon="i-lucide-x"
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  :aria-label="section.remove"
                  @click="removePerson(section.field, person.id)"
                />
              </li>
            </ul>

            <USelectMenu
              :model-value="undefined"
              :items="availableUsers(section.field)"
              value-key="value"
              :placeholder="section.placeholder"
              icon="i-lucide-user-plus"
              :search-input="{ placeholder: 'Поиск…' }"
              class="w-full"
              @update:model-value="addPerson(section.field, $event)"
            />
          </div>
        </aside>
      </div>
    </template>
  </USlideover>
</template>
