<script setup lang="ts">
import { ref } from 'vue';
import { createTaskFile } from '../model/createTaskFile';
import FilePickerButton from './FilePickerButton.vue';
import type { TaskFile } from '@/shared/types/task';
import type { Editor } from '@tiptap/vue-3';
import type { EditorToolbarItem } from '@nuxt/ui';

const model = defineModel<string>({ default: '' });

const emit = defineEmits<{ filesAdded: [files: TaskFile[]] }>();

const insertImages = (editor: Editor, files: File[]) => {
  const added = files.map(createTaskFile);
  for (const taskFile of added) {
    editor.chain().focus().setImage({ src: taskFile.url, alt: taskFile.name }).run();
  }
  if (added.length) emit('filesAdded', added);
};

const linkOpen = ref(false);
const linkUrl = ref('');

const toolbarItems: EditorToolbarItem[][] = [
  [
    { kind: 'mark', mark: 'bold', icon: 'i-lucide-bold' },
    { kind: 'mark', mark: 'italic', icon: 'i-lucide-italic' },
    { kind: 'mark', mark: 'strike', icon: 'i-lucide-strikethrough' },
    { kind: 'mark', mark: 'code', icon: 'i-lucide-code' },
  ],
  [
    { kind: 'heading', level: 2, icon: 'i-lucide-heading-2' },
    { kind: 'bulletList', icon: 'i-lucide-list' },
    { kind: 'orderedList', icon: 'i-lucide-list-ordered' },
    { kind: 'blockquote', icon: 'i-lucide-text-quote' },
    { kind: 'codeBlock', icon: 'i-lucide-square-code' },
  ],
];

const onLinkToggle = (open: boolean, editor: Editor) => {
  if (open) linkUrl.value = editor.getAttributes('link').href ?? '';
};

const applyLink = (editor: Editor) => {
  const raw = linkUrl.value.trim();
  const chain = editor.chain().focus().extendMarkRange('link');
  if (!raw) {
    chain.unsetLink().run();
  } else {
    const href = /^(https?:\/\/|mailto:|tel:|\/|#)/i.test(raw) ? raw : `https://${raw}`;
    chain.setLink({ href }).run();
  }
  linkOpen.value = false;
};

const removeLink = (editor: Editor) => {
  editor.chain().focus().extendMarkRange('link').unsetLink().run();
  linkOpen.value = false;
};
</script>

<template>
  <UEditor
    v-slot="{ editor }"
    v-model="model"
    content-type="markdown"
    placeholder="Добавьте описание задачи…"
    class="editor w-full flex-none shrink-0 min-h-64 rounded-md border border-default"
    :ui="{ base: 'p-3 sm:px-3' }"
  >
    <div class="flex items-center gap-1 border-b border-default px-2 py-1">
      <UEditorToolbar :editor="editor" :items="toolbarItems" />

      <UPopover v-model:open="linkOpen" @update:open="onLinkToggle($event, editor)">
        <UButton
          icon="i-lucide-link"
          color="neutral"
          :variant="editor.isActive('link') ? 'soft' : 'ghost'"
          size="sm"
          aria-label="Ссылка"
        />
        <template #content>
          <div class="flex items-center gap-1 p-2">
            <UInput
              v-model="linkUrl"
              placeholder="https://…"
              size="sm"
              class="w-64"
              autofocus
              @keydown.enter.prevent="applyLink(editor)"
            />
            <UButton
              icon="i-lucide-check"
              size="sm"
              aria-label="Применить"
              @click="applyLink(editor)"
            />
            <UButton
              v-if="editor.isActive('link')"
              icon="i-lucide-unlink"
              color="neutral"
              variant="ghost"
              size="sm"
              aria-label="Убрать ссылку"
              @click="removeLink(editor)"
            />
          </div>
        </template>
      </UPopover>

      <FilePickerButton
        icon="i-lucide-image"
        accept="image/*"
        variant="ghost"
        aria-label="Вставить изображение"
        @picked="insertImages(editor, $event)"
      />
    </div>
  </UEditor>
</template>

<style scoped>
/* primary = black, поэтому стандартное selection:bg-primary/20 почти не видно */
.editor :deep(.ProseMirror ::selection) {
  background-color: rgb(14 165 233 / 0.35) !important;
}

.editor :deep(.ProseMirror .is-editor-empty:first-child::before) {
  color: var(--ui-text-muted) !important;
  font-weight: 500;
}

.editor :deep(.ProseMirror img) {
  max-width: 100%;
  border-radius: 0.375rem;
}

.editor :deep(.ProseMirror a) {
  color: var(--ui-color-secondary-500);
  text-decoration: underline;
  cursor: pointer;
}
</style>
