<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Button from 'primevue/button';

const isDark = ref(false);

const applyTheme = (dark: boolean) => {
  document.documentElement.classList.toggle('my-app-dark', dark);
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
};

const toggleTheme = () => {
  isDark.value = !isDark.value;
  applyTheme(isDark.value);
  localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
};

onMounted(() => {
  const saved = localStorage.getItem('theme');
  isDark.value = saved === 'dark';
  applyTheme(isDark.value);
});
</script>

<template>
  <Button
    :icon="isDark ? 'pi pi-sun' : 'pi pi-moon'"
    :label="isDark ? 'Светлая тема' : 'Тёмная тема'"
    @click="toggleTheme"
    severity="secondary"
    rounded
  />
</template>
