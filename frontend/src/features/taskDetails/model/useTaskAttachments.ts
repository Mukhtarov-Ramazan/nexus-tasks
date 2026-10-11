import type { Task, TaskFile } from '@/shared/types/task';

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/** Файлы задачи и их синхронизация с изображениями в описании */
export const useTaskAttachments = (
  getTask: () => Task | null,
  patch: (value: Partial<Task>) => void
) => {
  // Удалённые файлы (url → файл): если изображение вернули через Ctrl+Z, файл возвращается в список
  const removedFiles = new Map<string, TaskFile>();

  const addFiles = (files: TaskFile[]) => {
    const task = getTask();
    if (task) patch({ files: [...(task.files ?? []), ...files] });
  };

  const removeFile = (id: string) => {
    const task = getTask();
    const file = task?.files?.find(f => f.id === id);
    if (!task || !file) return;
    removedFiles.set(file.url, file);
    // Вместе с файлом убираем его изображения из описания
    const image = new RegExp(`!\\[[^\\]]*\\]\\(${escapeRegExp(file.url)}[^)]*\\)\\n*`, 'g');
    patch({
      files: task.files?.filter(f => f.id !== id),
      description: (task.description ?? '').replace(image, ''),
    });
  };

  // Изображение, удалённое из описания, пропадает и из файлов; вернулось в описание — вернулось и в файлы
  const updateDescription = (value: string) => {
    const task = getTask();
    if (!task) return;
    const previous = task.description ?? '';
    const files = task.files ?? [];

    const orphaned = files.filter(f => previous.includes(f.url) && !value.includes(f.url));
    orphaned.forEach(f => removedFiles.set(f.url, f));

    const restored = [...removedFiles.values()].filter(
      f => value.includes(f.url) && !files.some(existing => existing.id === f.id)
    );
    restored.forEach(f => removedFiles.delete(f.url));

    if (!orphaned.length && !restored.length) return patch({ description: value });
    patch({
      description: value,
      files: [...files.filter(f => !orphaned.includes(f)), ...restored],
    });
  };

  return { addFiles, removeFile, updateDescription };
};
