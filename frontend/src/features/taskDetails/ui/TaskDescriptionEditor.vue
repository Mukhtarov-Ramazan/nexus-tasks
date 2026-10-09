<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
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

// Сворачивание длинного описания
const COLLAPSED_MAX_PX = 320;
const root = ref<HTMLElement | null>(null);
const expanded = ref(false);
const overflowing = ref(false);
const collapsedClass =
  'h-auto ' +
  'max-h-80 overflow-hidden [mask-image:linear-gradient(to_bottom,#000_calc(100%-3rem),transparent)]';

const checkOverflow = () => {
  const content = root.value?.querySelector<HTMLElement>('.ProseMirror');
  // Ограничение высоты стоит на обёртке, поэтому .ProseMirror всегда имеет полную высоту
  overflowing.value = !!content && content.offsetHeight > COLLAPSED_MAX_PX + 1;
};

let mutationObserver: MutationObserver | undefined;
let resizeObserver: ResizeObserver | undefined;

onMounted(() => {
  if (!root.value) return;
  mutationObserver = new MutationObserver(checkOverflow);
  mutationObserver.observe(root.value, { childList: true, subtree: true, characterData: true });
  resizeObserver = new ResizeObserver(checkOverflow);
  resizeObserver.observe(root.value);
  checkOverflow();
});

onBeforeUnmount(() => {
  mutationObserver?.disconnect();
  resizeObserver?.disconnect();
});

const toolbarItems: EditorToolbarItem[][] = [
  [
    { kind: 'mark', mark: 'bold', icon: 'i-lucide-bold', tooltip: { text: 'Жирный' } },
    { kind: 'mark', mark: 'italic', icon: 'i-lucide-italic', tooltip: { text: 'Курсив' } },
    {
      kind: 'mark',
      mark: 'strike',
      icon: 'i-lucide-strikethrough',
      tooltip: { text: 'Зачёркнутый' },
    },
    { kind: 'mark', mark: 'code', icon: 'i-lucide-code', tooltip: { text: 'Код в строке' } },
  ],
  [
    { kind: 'heading', level: 2, icon: 'i-lucide-heading-2', tooltip: { text: 'Заголовок' } },
    { kind: 'bulletList', icon: 'i-lucide-list', tooltip: { text: 'Маркированный список' } },
    {
      kind: 'orderedList',
      icon: 'i-lucide-list-ordered',
      tooltip: { text: 'Нумерованный список' },
    },
    { kind: 'blockquote', icon: 'i-lucide-text-quote', tooltip: { text: 'Цитата' } },
    { kind: 'codeBlock', icon: 'i-lucide-square-code', tooltip: { text: 'Блок кода' } },
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
  <div ref="root" class="flex w-full shrink-0 flex-col gap-1">
    <UEditor
      v-slot="{ editor }"
      v-model="model"
      content-type="markdown"
      placeholder="Добавьте описание задачи…"
      class="editor w-full flex-none shrink-0 min-h-64 rounded-md border border-default"
      :ui="{ base: 'p-3 sm:px-3', content: overflowing && !expanded ? collapsedClass : 'h-auto' }"
    >
      <div class="flex items-center gap-1 border-b border-default px-2 py-1">
        <UEditorToolbar :editor="editor" :items="toolbarItems" />

        <UPopover v-model:open="linkOpen" @update:open="onLinkToggle($event, editor)">
          <UTooltip text="Ссылка">
            <UButton
              icon="i-lucide-link"
              color="neutral"
              :variant="editor.isActive('link') ? 'soft' : 'ghost'"
              size="sm"
              aria-label="Ссылка"
            />
          </UTooltip>
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

        <UTooltip text="Вставить изображение">
          <FilePickerButton
            icon="i-lucide-image"
            accept="image/*"
            variant="ghost"
            aria-label="Вставить изображение"
            @picked="insertImages(editor, $event)"
          />
        </UTooltip>
      </div>
    </UEditor>

    <UButton
      v-if="overflowing || expanded"
      :icon="expanded ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
      :label="expanded ? 'Свернуть' : 'Развернуть'"
      color="neutral"
      variant="ghost"
      size="xs"
      class="relative z-10 self-start"
      @click="expanded = !expanded"
    />
  </div>
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
