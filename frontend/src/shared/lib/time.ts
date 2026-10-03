/** Часы (может быть дробным) → «2 ч 30 м» */
export const formatHours = (hours: number): string => {
  const totalMinutes = Math.round(hours * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (!h && !m) return '0 ч';
  return [h && `${h} ч`, m && `${m} м`].filter(Boolean).join(' ');
};

/** Секунды → «HH:MM:SS» */
export const formatClock = (totalSeconds: number): string => {
  const pad = (n: number) => String(n).padStart(2, '0');
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  return `${pad(h)}:${pad(m)}:${pad(totalSeconds % 60)}`;
};

/** «HH:MM:SS» | «MM:SS» | «минуты» → секунды, null если не распознано */
export const parseClock = (value: string): number | null => {
  const text = value.trim();
  if (!text) return 0;
  const parts = text.split(':').map(Number);
  if (parts.length > 3 || parts.some(p => !Number.isFinite(p) || p < 0)) return null;
  if (parts.length === 1) return Math.round(parts[0]! * 60);
  return Math.round(parts.reduce((acc, p) => acc * 60 + p, 0));
};

/** Байты → «1.2 МБ» */
export const formatBytes = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} Б`;
  const units = ['КБ', 'МБ', 'ГБ'];
  let value = bytes / 1024;
  let i = 0;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i++;
  }
  return `${value.toFixed(value < 10 ? 1 : 0)} ${units[i]}`;
};
