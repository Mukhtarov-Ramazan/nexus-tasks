/**
 * Палитра колонок канбан-доски. Классы записаны целиком,
 * чтобы Tailwind увидел их при сборке.
 */
export const columnColors: Record<string, { label: string; bg: string; text: string }> = {
  neutral: { label: 'Серый', bg: 'bg-neutral-500', text: 'text-white' },
  secondary: { label: 'Голубой', bg: 'bg-(--ui-secondary)', text: 'text-white' },
  info: { label: 'Синий', bg: 'bg-(--ui-info)', text: 'text-white' },
  success: { label: 'Зелёный', bg: 'bg-(--ui-success)', text: 'text-white' },
  warning: { label: 'Жёлтый', bg: 'bg-(--ui-warning)', text: 'text-white' },
  error: { label: 'Красный', bg: 'bg-(--ui-error)', text: 'text-white' },
  orange: { label: 'Оранжевый', bg: 'bg-orange-500', text: 'text-white' },
  lime: { label: 'Салатовый', bg: 'bg-lime-500', text: 'text-white' },
  teal: { label: 'Бирюзовый', bg: 'bg-teal-500', text: 'text-white' },
  indigo: { label: 'Индиго', bg: 'bg-indigo-500', text: 'text-white' },
  violet: { label: 'Фиолетовый', bg: 'bg-violet-500', text: 'text-white' },
  fuchsia: { label: 'Пурпурный', bg: 'bg-fuchsia-500', text: 'text-white' },
  pink: { label: 'Розовый', bg: 'bg-pink-500', text: 'text-white' },
};

export const defaultColumnColor = 'neutral';
