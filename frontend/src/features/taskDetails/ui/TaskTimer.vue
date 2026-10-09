<script setup lang="ts">
import { computed, ref } from 'vue';
import { formatClock, parseClock } from '@/shared/lib/time';
import { useTimerStore } from '@/stores/timer';

const props = defineProps<{ taskId: string }>();
const emit = defineEmits<{ add: [hours: number] }>();

const timer = useTimerStore();
const inputKey = ref(0);

const running = computed(() => timer.isRunning(props.taskId));
const seconds = computed(() => timer.seconds(props.taskId));

const start = () => timer.start(props.taskId);
const pause = () => timer.pause(props.taskId);

const commit = () => {
  const total = timer.reset(props.taskId);
  if (total > 0) emit('add', total / 3600);
};

const onManualInput = (event: Event) => {
  const parsed = parseClock((event.target as HTMLInputElement).value);
  if (parsed !== null) timer.setSeconds(props.taskId, parsed);
  inputKey.value++; // перерисовать поле отформатированным значением
};
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
