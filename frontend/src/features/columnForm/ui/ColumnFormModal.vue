<script setup lang="ts">
import { ref, watch } from 'vue';
import { columnColors, defaultColumnColor } from '@/shared/config';
import type { KanbanColumn } from '@/shared/types/column';

const props = defineProps<{ column: KanbanColumn | null }>();
const open = defineModel<boolean>('open', { default: false });
const emit = defineEmits<{ submit: [data: Pick<KanbanColumn, 'title' | 'color'>] }>();

const title = ref('');
const color = ref(defaultColumnColor);
const touched = ref(false);

// Каждое открытие — свежее состояние формы (пустое или с данными редактируемой колонки)
watch(open, isOpen => {
  if (!isOpen) return;
  title.value = props.column?.title ?? '';
  color.value = props.column?.color ?? defaultColumnColor;
  touched.value = false;
});

const submit = () => {
  touched.value = true;
  const value = title.value.trim();
  if (!value) return;
  emit('submit', { title: value, color: color.value });
  open.value = false;
};
</script>

<template>
  <UModal v-model:open="open" :title="column ? 'Редактировать колонку' : 'Новая колонка'">
    <template #body>
      <form class="flex flex-col gap-5" @submit.prevent="submit">
        <UFormField
          label="Название"
          required
          :error="touched && !title.trim() ? 'Введите название колонки' : undefined"
        >
          <UInput v-model="title" autofocus placeholder="Например, В работе" class="w-full" />
        </UFormField>

        <UFormField label="Цвет">
          <div class="flex flex-wrap gap-2">
            <UTooltip v-for="(item, key) in columnColors" :key="key" :text="item.label">
              <button
                type="button"
                :aria-label="item.label"
                :aria-pressed="color === key"
                class="flex size-8 items-center justify-center rounded-full outline-offset-2 transition-transform hover:scale-110"
                :class="[item.bg, color === key ? 'outline-2 outline-default' : 'outline-0']"
                @click="color = key as string"
              >
                <UIcon
                  v-if="color === key"
                  name="i-lucide-check"
                  class="size-4"
                  :class="item.text"
                />
              </button>
            </UTooltip>
          </div>
        </UFormField>

        <div class="grid grid-cols-2 gap-3">
          <UButton
            color="neutral"
            variant="ghost"
            size="xl"
            block
            class="justify-center bg-elevated text-muted hover:bg-accented"
            @click="open = false"
          >
            Отмена
          </UButton>
          <UButton
            type="submit"
            color="neutral"
            size="xl"
            block
            class="justify-center bg-indigo-600 text-white hover:bg-indigo-700"
          >
            {{ column ? 'Редактировать' : 'Создать' }}
          </UButton>
        </div>
      </form>
    </template>
  </UModal>
</template>
