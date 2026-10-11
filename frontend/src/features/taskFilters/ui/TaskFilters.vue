<script setup lang="ts">
import { computed } from 'vue';
import { complexityMap, mockUsers, priorityMap, typeMap } from '@/shared/config';
import { countFilters, emptyFilters, type TaskFilters } from '../model';

const filters = defineModel<TaskFilters>({ required: true });

const count = computed(() => countFilters(filters.value));

const toItems = (map: Record<string, { label: string }>) =>
  Object.entries(map).map(([value, { label }]) => ({ value, label }));

const typeItems = toItems(typeMap);
const priorityItems = toItems(priorityMap);
const complexityItems = toItems(complexityMap);
const userItems = mockUsers.map(u => ({ value: u.id, label: u.fullName }));

const reset = () => (filters.value = emptyFilters());
</script>

<template>
  <UPopover :content="{ align: 'start' }">
    <UButton
      icon="i-lucide-list-filter"
      :color="count ? 'secondary' : 'neutral'"
      :variant="count ? 'solid' : 'outline'"
      :class="{ 'text-white': count }"
      size="md"
      aria-label="Фильтры"
    >
      Фильтры
      <UBadge v-if="count" :label="count" color="neutral" variant="solid" size="sm" />
    </UButton>

    <template #content>
      <div class="flex w-80 flex-col gap-3 p-4">
        <UFormField label="Тип">
          <USelectMenu
            v-model="filters.types"
            :items="typeItems"
            value-key="value"
            multiple
            placeholder="Любой"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Исполнитель">
          <USelectMenu
            v-model="filters.assigneeIds"
            :items="userItems"
            value-key="value"
            multiple
            placeholder="Любой"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Приоритет">
          <USelectMenu
            v-model="filters.priorities"
            :items="priorityItems"
            value-key="value"
            multiple
            placeholder="Любой"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Сложность">
          <USelectMenu
            v-model="filters.complexities"
            :items="complexityItems"
            value-key="value"
            multiple
            placeholder="Любая"
            class="w-full"
          />
        </UFormField>
        <USwitch v-model="filters.overdue" label="Только просроченные" color="secondary" />

        <UButton
          color="neutral"
          variant="outline"
          :disabled="!count"
          class="justify-center"
          @click="reset"
        >
          Сбросить
        </UButton>
      </div>
    </template>
  </UPopover>
</template>
