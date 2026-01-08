<script setup lang="ts">
import { ref, reactive } from 'vue';
import type { FormError, FormSubmitEvent } from '@nuxt/ui';

type Schema = typeof state;

const showPass = ref(false);
const state = reactive({
  email: '',
  password: '',
});

function validate(state: Partial<Schema>): FormError[] {
  const errors = [];
  if (!state.email) errors.push({ name: 'email', message: 'Required' });
  if (!state.password) errors.push({ name: 'password', message: 'Required' });
  return errors;
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  console.log(event.data)
}

// const password = ref('');
</script>

<template>
  <UForm :validate="validate" :state="state" class="login-block" @submit="onSubmit">
    <!-- <form class="login-block" @submit="onSubmit">
    </form> -->
    <UFormField label="Email">
      <UInput
        v-model="state.email"
        type="email"
        size="xl"
        placeholder="Введите почту"
        class="w-full"
      />
    </UFormField>

    <UFormField label="Пароль">
      <UInput
        v-model="state.password"
        :type="showPass ? 'text' : 'password'"
        size="xl"
        placeholder="Введите пароль"
        :ui="{ trailing: 'pe-1' }"
        class="w-full"
      >
        <template #trailing>
          <UButton
            color="neutral"
            variant="link"
            size="sm"
            :icon="showPass ? 'i-lucide-eye-off' : 'i-lucide-eye'"
            :aria-label="showPass ? 'Скрыть пароль' : 'Показать пароль'"
            :aria-pressed="showPass"
            aria-controls="password"
            @click="showPass = !showPass"
          />
        </template>
      </UInput>
    </UFormField>

    <!-- <div class="consent">
      Регистрируясь, вы даёте согласие на обработку персональных данных согласно
      <ULink to="/privacy-policy" target="_blank">Политике конфиденциальности</ULink>.
    </div> -->

    <UButton type="submit" color="neutral" block>Войти</UButton>

    <div class="link">
      Нет аккаунта?
      <ULink to="/registration">Зарегистрироваться</ULink>
    </div>
  </UForm>
</template>

<style scoped lang="scss">
.login-block {
  width: 100%;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.consent {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin-bottom: 8px;
}
.login-link {
  font-size: 14px;
  text-align: center;
  margin-top: 10px;
}
</style>
