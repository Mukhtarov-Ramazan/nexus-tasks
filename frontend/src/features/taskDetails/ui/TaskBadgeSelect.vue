<script setup lang="ts">
import { computed } from 'vue';
import type { BadgeColor } from '@/shared/config/taskMeta';

type Option = { label: string; color: BadgeColor; icon?: string };

const props = defineProps<{
  modelValue: string;
  options: Record<string, Option>;
  variant: 'subtle' | 'outline' | 'soft';}>();
const emit = defineEmits<{ 'update:modelValue': [value: string] }>();

const items = computed(() =>
  // icon не передаём в item: иначе USelect дублирует её слева от бейджа
  Object.entries(props.options).map(([value, { label, color }]) => ({ value, label, color }))
);
</script>

<template>
  <USelect
    :model-value="modelValue"
    :items="items"
    class="w-full"
    @update:model-value="emit('update:modelValue', $event as string)"
  >
    <template #default>
      <UBadge
        v-if="options[modelValue]"
        :color="options[modelValue].color"
        :icon="options[modelValue].icon"
        :variant="variant"
        size="sm"
      >
        {{ options[modelValue].label }}
      </UBadge>
    </template>
    <template #item-label="{ item }">
      <UBadge
        :color="options[(item as { value: string }).value]?.color"
        :icon="options[(item as { value: string }).value]?.icon"
        :variant="variant"
        size="sm"
      >
        {{ options[(item as { value: string }).value]?.label }}
      </UBadge>
    </template>
  </USelect>
</template>
