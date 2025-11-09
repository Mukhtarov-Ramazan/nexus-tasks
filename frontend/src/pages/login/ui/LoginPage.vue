<script setup lang="ts">
import { LoginBlock } from '@/widgets/loginBlock';
</script>

<template>
  <div class="login">
    <div class="login__wrapper">
      <h1 class="login__title">NexusTasks</h1>
      <UColorModeButton />

      <LoginBlock />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login {
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
