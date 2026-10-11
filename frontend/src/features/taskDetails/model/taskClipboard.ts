import { ROUTES } from '@/shared/config';

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const taskLabel = (task: { id: string; title: string }) => `${task.id} ${task.title}`;

export const copyTaskLabel = (task: { id: string; title: string }) =>
  navigator.clipboard.writeText(taskLabel(task));

// Название-гиперссылка: text/html для документов и чатов, text/plain (ссылка) как запасной вариант
export const copyTaskLink = (task: { id: string; title: string }) => {
  const url = `${window.location.origin}${ROUTES.tasks}/${task.id}`;
  const label = taskLabel(task);
  const html = `<a href="${escapeHtml(url)}">${escapeHtml(label)}</a>`;
  return navigator.clipboard.write([
    new ClipboardItem({
      'text/html': new Blob([html], { type: 'text/html' }),
      'text/plain': new Blob([`${label} ${url}`], { type: 'text/plain' }),
    }),
  ]);
};
