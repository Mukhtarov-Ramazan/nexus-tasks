<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
  isUser: { type: Boolean, default: false },
});

const showPass = ref(false);
const showPassConfirm = ref(false);
const password = ref('');

const onSubmit = (): void => {
  console.log('Зарегистрироваться');
};
</script>

<template>
  <form class="registration-form" @submit="onSubmit">
    <UFormField v-if="!props.isUser" label="Название компании">
      <UInput size="xl" placeholder="Введите название компании" class="w-full" />
    </UFormField>

    <UFormField label="Email">
      <UInput size="xl" placeholder="Введите почту" type="email" class="w-full" />
    </UFormField>

    <UFormField label="Пароль">
      <UInput
        v-model="password"
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

    <UFormField label="Подтвердите пароль">
      <UInput
        v-model="password"
        :type="showPassConfirm ? 'text' : 'password'"
        size="xl"
        placeholder="Введите пароль повторно"
        :ui="{ trailing: 'pe-1' }"
        class="w-full"
      >
        <template #trailing>
          <UButton
            color="neutral"
            variant="link"
            size="sm"
            :icon="showPassConfirm ? 'i-lucide-eye-off' : 'i-lucide-eye'"
            :aria-label="showPassConfirm ? 'Скрыть пароль' : 'Показать пароль'"
            :aria-pressed="showPassConfirm"
            aria-controls="password"
            @click="showPassConfirm = !showPassConfirm"
          />
        </template>
      </UInput>
    </UFormField>

    <!-- <div class="consent">
      Регистрируясь, вы даёте согласие на обработку персональных данных согласно
      <ULink to="/privacy-policy" target="_blank">Политике конфиденциальности</ULink>.
    </div> -->

    <UButton type="submit" color="neutral" block>Зарегистрироваться</UButton>

    <div class="link">
      Уже есть аккаунт?
      <ULink to="/login">Войти</ULink>
    </div>
  </form>
</template>

<style scoped lang="scss">
.registration-form {
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
.link {
  font-size: 14px;
  text-align: center;
  margin-top: 10px;
}
</style>
