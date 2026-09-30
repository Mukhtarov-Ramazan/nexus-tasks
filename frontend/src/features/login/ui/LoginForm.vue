<script setup lang="ts">
import { reactive } from 'vue';
import type { FormError, FormSubmitEvent } from '@nuxt/ui';
import { ROUTES } from '@/shared/config';
import { PasswordInput } from '@/shared/ui';

const state = reactive({
  email: '',
  password: '',
});

type Schema = typeof state;

function validate(values: Partial<Schema>): FormError[] {
  const errors: FormError[] = [];
  if (!values.email) errors.push({ name: 'email', message: 'Введите почту' });
  if (!values.password) errors.push({ name: 'password', message: 'Введите пароль' });
  return errors;
}

function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log(event.data);
}
</script>

<template>
  <UForm
    :validate="validate"
    :state="state"
    class="mt-5 flex w-full flex-col gap-4"
    @submit="onSubmit"
  >
    <UFormField label="Email" name="email">
      <UInput
        v-model="state.email"
        type="email"
        size="xl"
        placeholder="Введите почту"
        class="w-full"
      />
    </UFormField>

    <UFormField label="Пароль" name="password">
      <PasswordInput v-model="state.password" placeholder="Введите пароль" />
    </UFormField>

    <UButton type="submit" color="neutral" block>Войти</UButton>

    <div class="mt-2.5 text-center text-sm">
      Нет аккаунта?
      <ULink :to="ROUTES.registration">Зарегистрироваться</ULink>
    </div>
  </UForm>
</template>
