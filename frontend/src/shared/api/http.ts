// Единая точка обращения к бэкенду. Бэкенд ещё не выбран, поэтому реализация — заглушка.
export async function request<T>(_path: string, _init?: RequestInit): Promise<T> {
  throw new Error('API не подключён: бэкенд ещё не выбран');
}
