<script setup lang="ts">
import { RegistrationBlock } from '@/widgets/registrationBlock';
</script>

<template>
  <div class="auth">
    <div class="auth__wrapper">
      <h1 class="auth__title">NexusTasks</h1>
      <UColorModeButton />

      <RegistrationBlock />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.auth {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  &__wrapper {
    width: 100%;
    max-width: 560px;
  }

  &__title {
    text-align: center;
    margin-bottom: 12px;
    font-size: 2rem;
    font-weight: 700;
    //color: var(--color-primary);
  }
}
</style>
