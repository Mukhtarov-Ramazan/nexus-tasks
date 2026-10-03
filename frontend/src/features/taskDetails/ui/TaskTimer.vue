<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
import { formatClock, parseClock } from '@/shared/lib/time';

const emit = defineEmits<{ add: [hours: number] }>();

const baseSeconds = ref(0);
const startedAt = ref<number | null>(null);
const now = ref(Date.now());
const inputKey = ref(0);
let timerId: ReturnType<typeof setInterval> | undefined;

const running = computed(() => startedAt.value !== null);
const seconds = computed(
  () => baseSeconds.value + (startedAt.value ? Math.floor((now.value - startedAt.value) / 1000) : 0)
);

const start = () => {
  now.value = startedAt.value = Date.now();
  timerId = setInterval(() => (now.value = Date.now()), 500);
};

const pause = () => {
  baseSeconds.value = seconds.value;
  startedAt.value = null;
  clearInterval(timerId);
};

const commit = () => {
  const total = seconds.value;
  pause();
  baseSeconds.value = 0;
  if (total > 0) emit('add', total / 3600);
};

const onManualInput = (event: Event) => {
  const parsed = parseClock((event.target as HTMLInputElement).value);
  if (parsed !== null) baseSeconds.value = parsed;
  inputKey.value++; // перерисовать поле отформатированным значением
};

// Если панель закрыли при работающем таймере — не теряем время
onBeforeUnmount(() => {
  if (running.value) commit();
  else clearInterval(timerId);
});
</script>

<template>
  <div class="flex flex-col gap-2">
    <UInput
      :key="inputKey"
      :model-value="formatClock(seconds)"
      :readonly="running"
      placeholder="00:00:00"
      class="w-full"
      :ui="{ base: 'font-mono tabular-nums' }"
      @change="onManualInput"
    />
    <div class="flex gap-2">
      <UButton
        :icon="running ? 'i-lucide-pause' : 'i-lucide-play'"
        :label="running ? 'Стоп' : 'Старт'"
        :color="running ? 'error' : 'neutral'"
        :variant="running ? 'soft' : 'solid'"
        :class="running ? '' : 'bg-indigo-600 text-white hover:bg-indigo-500'"
        size="sm"
        class="flex-1 justify-center"
        @click="running ? pause() : start()"
      />
      <UButton
        icon="i-lucide-plus"
        label="Записать"
        color="neutral"
        variant="outline"
        size="sm"
        class="flex-1 justify-center"
        :disabled="seconds === 0"
        @click="commit"
      />
    </div>
  </div>
</template>
