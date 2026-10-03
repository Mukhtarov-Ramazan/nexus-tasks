<script setup lang="ts">
import { formatBytes } from '@/shared/lib/time';
import type { TaskFile } from '@/shared/types/task';
import { createTaskFile } from '../model/createTaskFile';
import FilePickerButton from './FilePickerButton.vue';

defineProps<{ files: TaskFile[] }>();
const emit = defineEmits<{ add: [files: TaskFile[]]; remove: [id: string] }>();

const addFiles = (picked: File[]) => emit('add', picked.map(createTaskFile));
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex items-center justify-between">
      <span class="text-sm font-medium">Файлы</span>
      <FilePickerButton icon="i-lucide-paperclip" label="Добавить файл" @picked="addFiles" />
    </div>

    <p v-if="!files.length" class="text-sm text-muted">Файлов пока нет</p>

    <ul v-else class="grid grid-cols-[repeat(auto-fill,minmax(9rem,1fr))] gap-3">
      <li
        v-for="file in files"
        :key="file.id"
        class="group relative flex flex-col overflow-hidden rounded-md border border-default"
      >
        <div class="block">
          <img
            v-if="file.mimeType.startsWith('image/')"
            :src="file.url"
            :alt="file.name"
            class="aspect-4/3 w-full object-cover"
          />
          <div v-else class="flex aspect-4/3 w-full items-center justify-center bg-elevated">
            <UIcon name="i-lucide-file" class="size-8 text-muted" />
          </div>
        </div>

        <div class="flex min-w-0 flex-col gap-0.5 p-2">
          <span class="truncate text-xs font-medium" :title="file.name">{{ file.name }}</span>
          <span class="text-xs text-muted">{{ formatBytes(file.size) }}</span>
        </div>

        <UButton
          icon="i-lucide-download"
          color="neutral"
          variant="solid"
          size="xs"
          :href="file.url"
          :download="file.name"
          aria-label="Скачать файл"
          class="absolute top-1.5 left-1.5 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
        />

        <UButton
          icon="i-lucide-trash-2"
          color="neutral"
          variant="solid"
          size="xs"
          aria-label="Удалить файл"
          class="absolute top-1.5 right-1.5 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
          @click="emit('remove', file.id)"
        />
      </li>
    </ul>
  </div>
</template>
