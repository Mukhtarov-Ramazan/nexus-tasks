import { computed, ref, watch } from 'vue';
import { defineStore } from 'pinia';

interface TimerEntry {
  baseSeconds: number;
  startedAt: number | null;
}

const STORAGE_KEY = 'nexus-tasks:timers';

const load = (): Record<string, TimerEntry> => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
  } catch {
    return {};
  }
};

/** Таймеры задач живут вне компонентов, хранятся в localStorage и синхронизируются между вкладками */
export const useTimerStore = defineStore('timer', () => {
  const entries = ref<Record<string, TimerEntry>>(load());
  const now = ref(Date.now());
  let intervalId: ReturnType<typeof setInterval> | undefined;

  /** Одновременно работает только один таймер */
  const activeId = computed(
    () => Object.keys(entries.value).find(id => entries.value[id]!.startedAt !== null) ?? null
  );

  // Тикаем только пока есть запущенный таймер (в том числе запущенный в другой вкладке)
  watch(
    activeId,
    id => {
      clearInterval(intervalId);
      intervalId = undefined;
      if (id) {
        now.value = Date.now();
        intervalId = setInterval(() => (now.value = Date.now()), 500);
      }
    },
    { immediate: true }
  );

  watch(
    entries,
    value => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
      } catch {
        // localStorage недоступен — работаем без сохранения
      }
    },
    { deep: true }
  );

  window.addEventListener('storage', event => {
    if (event.key === STORAGE_KEY) entries.value = load();
  });

  const isRunning = (id: string) => entries.value[id]?.startedAt != null;

  const seconds = (id: string) => {
    const entry = entries.value[id];
    if (!entry) return 0;
    const elapsed = entry.startedAt ? Math.floor((now.value - entry.startedAt) / 1000) : 0;
    return entry.baseSeconds + elapsed;
  };

  const pause = (id: string) => {
    const entry = entries.value[id];
    if (!entry || entry.startedAt === null) return;
    entry.baseSeconds = seconds(id);
    entry.startedAt = null;
  };

  const start = (id: string) => {
    if (activeId.value && activeId.value !== id) pause(activeId.value);
    now.value = Date.now();
    entries.value[id] = { baseSeconds: seconds(id), startedAt: now.value };
  };

  const setSeconds = (id: string, value: number) => {
    entries.value[id] = { baseSeconds: value, startedAt: null };
  };

  /** Останавливает таймер и обнуляет его, возвращает накопленные секунды */
  const reset = (id: string) => {
    const total = seconds(id);
    delete entries.value[id];
    return total;
  };

  return { activeId, isRunning, seconds, start, pause, setSeconds, reset };
});
