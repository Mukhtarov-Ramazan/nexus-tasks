<script setup lang="ts">
import { computed, ref } from 'vue';
import { CalendarDate, Time } from '@internationalized/date';

const props = defineProps<{ modelValue: string; overdue?: boolean }>();
const emit = defineEmits<{ 'update:modelValue': [iso: string] }>();

const open = ref(false);

const date = computed(() => new Date(props.modelValue));

const calendarValue = computed(
  () => new CalendarDate(date.value.getFullYear(), date.value.getMonth() + 1, date.value.getDate())
);
const timeValue = computed(() => new Time(date.value.getHours(), date.value.getMinutes()));

const label = computed(() =>
  date.value.toLocaleString('ru-RU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
);

const emitDate = (d: CalendarDate, t: Time) =>
  emit('update:modelValue', new Date(d.year, d.month - 1, d.day, t.hour, t.minute).toISOString());

const onDate = (value: unknown) => {
  if (value instanceof CalendarDate) emitDate(value, timeValue.value);
};

const onTime = (value: unknown) => {
  if (value && typeof value === 'object' && 'hour' in value) {
    const t = value as Time;
    emitDate(calendarValue.value, new Time(t.hour, t.minute));
  }
};
</script>

<template>
  <UPopover v-model:open="open">
    <UButton
      color="neutral"
      variant="outline"
      icon="i-lucide-calendar"
      class="w-full justify-start"
      :class="{ 'text-error': overdue }"
      :label="label"
    />

    <template #content>
      <div class="flex flex-col gap-3 p-3">
        <UCalendar
          :model-value="calendarValue"
          :year-controls="false"
          @update:model-value="onDate"
        />
        <div class="flex items-center justify-between gap-2 border-t border-default pt-3">
          <span class="text-xs text-muted">Время</span>
          <UInputTime
            :model-value="timeValue"
            :hour-cycle="24"
            granularity="minute"
            @update:model-value="onTime"
          />
        </div>
      </div>
    </template>
  </UPopover>
</template>
