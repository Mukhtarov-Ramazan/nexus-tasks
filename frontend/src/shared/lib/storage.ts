/** Читает JSON из localStorage; при ошибке или отсутствии значения возвращает fallback */
export const readStorage = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : (JSON.parse(raw) as T);
  } catch {
    return fallback;
  }
};

/** Пишет JSON в localStorage; если хранилище недоступно — молча работаем без сохранения */
export const writeStorage = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage недоступен
  }
};
