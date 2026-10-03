<script setup lang="ts">
/**
 * Кнопка выбора файлов. Нативный input лежит прозрачным слоем поверх кнопки,
 * поэтому клик в любую её часть (текст, иконка, отступы) открывает диалог без JS.
 */
defineProps<{
  label?: string;
  icon?: string;
  accept?: string;
  ariaLabel?: string;
  variant?: 'outline' | 'ghost' | 'solid' | 'soft' | 'subtle' | 'link';
  size?: 'xs' | 'sm' | 'md';
}>();
const emit = defineEmits<{ picked: [files: File[]] }>();

const onChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const files = Array.from(input.files ?? []);
  input.value = '';
  if (files.length) emit('picked', files);
};
</script>

<template>
  <div class="group/picker relative inline-flex">
    <UButton
      :label="label"
      :icon="icon"
      :aria-label="ariaLabel"
      color="neutral"
      :variant="variant ?? 'outline'"
      :size="size ?? 'sm'"
      tabindex="-1"
      class="pointer-events-none group-hover/picker:bg-elevated group-has-focus-visible/picker:ring-2 group-has-focus-visible/picker:ring-inverted"
    />
    <input
      type="file"
      multiple
      :accept="accept"
      :aria-label="ariaLabel ?? label"
      class="absolute inset-0 size-full cursor-pointer opacity-0"
      @change="onChange"
    />
  </div>
</template>
