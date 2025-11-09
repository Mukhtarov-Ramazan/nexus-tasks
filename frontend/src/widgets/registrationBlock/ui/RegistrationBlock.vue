<script setup lang="ts">
import RegistrationCompanyForm from '@/features/registration/ui/RegistrationCompanyForm.vue';

const items = [
  {
    label: 'Для компании',
    slot: 'company',
  },
  {
    label: 'Для себя',
    slot: 'user',
  },
];
</script>

<template>
  <div class="registration-block">
    <UTabs :items="items" color="neutral">
      <template #company>
        <RegistrationCompanyForm />
      </template>

      <template #user>
        <RegistrationCompanyForm is-user />
      </template>
    </UTabs>
  </div>
</template>

<style scoped lang="scss">
.registration-block {
  width: 100%;
}
</style>
