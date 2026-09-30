<script setup lang="ts">
import { ref, useId } from 'vue';

const model = defineModel<string>({ default: '' });

defineProps<{ placeholder?: string }>();

const show = ref(false);
const id = useId();
</script>

<template>
  <UInput
    :id="id"
    v-model="model"
    :type="show ? 'text' : 'password'"
    size="xl"
    :placeholder="placeholder"
    :ui="{ trailing: 'pe-1' }"
    class="w-full"
  >
    <template #trailing>
      <UButton
        color="neutral"
        variant="link"
        size="sm"
        :icon="show ? 'i-lucide-eye-off' : 'i-lucide-eye'"
        :aria-label="show ? 'Скрыть пароль' : 'Показать пароль'"
        :aria-pressed="show"
        :aria-controls="id"
        @click="show = !show"
      />
    </template>
  </UInput>
</template>
