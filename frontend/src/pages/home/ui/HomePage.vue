<script setup lang="ts">
import { ref } from 'vue';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Card from 'primevue/card';
import { ThemeToggle } from '@/shared/ui/theme-toggle';

const value = ref('');
const tableData = ref([
  { id: 1, name: 'Кнопка', type: 'Button' },
  { id: 2, name: 'Поле ввода', type: 'InputText' },
  { id: 3, name: 'Карточка', type: 'Card' }
]);
</script>

<template>
  <div class="container">
    <h1 class="title">NexusTasks</h1>
    <ThemeToggle />
    <Card class="mb-4">
      <template #title>Пример карточки</template>
      <template #content>
        Используйте карточки для отображения ключевого контента.
      </template>
    </Card>
    <form @submit.prevent>
      <InputText v-model="value" placeholder="Введите текст..." class="mb-2" />
      <Button type="submit" label="Отправить" />
    </form>
    <DataTable :value="tableData" class="mt-4">
      <Column field="id" header="ID"></Column>
      <Column field="name" header="Название"></Column>
      <Column field="type" header="Тип"></Column>
    </DataTable>
  </div>
</template>

<style scoped>
.container {
  padding: var(--spacing-lg);
}
.title {
  margin-bottom: var(--spacing-lg);
  font-family: var(--font-family-base);
  font-size: var(--font-size-title);
  color: var(--color-text-primary);
}
.mb-2 { margin-bottom: var(--spacing-md); }
.mb-4 { margin-bottom: var(--spacing-lg); }
.mt-4 { margin-top: var(--spacing-lg); }
</style>
