import type { TaskFile } from '@/shared/types/task';

export const createTaskFile = (file: File): TaskFile => ({
  id: crypto.randomUUID(),
  name: file.name,
  size: file.size,
  mimeType: file.type,
  url: URL.createObjectURL(file),
});
