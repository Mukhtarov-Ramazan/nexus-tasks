<script setup lang="ts">
import { RegistrationCompanyForm } from '@/features/registration';

const items = [
  { label: 'Для компании', slot: 'company' },
  { label: 'Для себя', slot: 'user' },
];
</script>

<template>
  <div class="w-full">
    <UTabs :items="items" color="neutral" size="lg">
      <template #company>
        <RegistrationCompanyForm />
      </template>

      <template #user>
        <RegistrationCompanyForm is-user />
      </template>
    </UTabs>
  </div>
</template>
