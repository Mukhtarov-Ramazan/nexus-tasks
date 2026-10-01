<script setup lang="ts">
import { AppHeader } from '@/widgets/appHeader';
import { AppSidebar } from '@/widgets/appSidebar';
</script>

<template>
  <div class="flex h-screen flex-col overflow-hidden">
    <AppHeader />

    <div class="flex min-h-0 flex-1">
      <AppSidebar />

      <main class="min-w-0 flex-1 overflow-y-auto p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
