<script setup lang="ts">
const props = defineProps({
  isUser: { type: Boolean, default: false },
});

const onSubmit = (): void => {
  console.log('Зарегистрироваться');
};
</script>

<template>
  <form class="registration-form" @submit="onSubmit">
    <UFormField v-if="!props.isUser" label="Название компании">
      <UInput placeholder="Введите название компании" class="w-full" />
    </UFormField>

    <UFormField label="Email">
      <UInput placeholder="Введите почту" type="email" class="w-full" />
    </UFormField>

    <UFormField label="Пароль">
      <UInput placeholder="Введите пароль" type="password" class="w-full" />
    </UFormField>

    <UFormField label="Подтвердите пароль">
      <UInput placeholder="Введите пароль повторно" type="password" class="w-full" />
    </UFormField>

    <div class="consent">
      Регистрируясь, вы даёте согласие на обработку персональных данных согласно
      <ULink to="/privacy-policy" target="_blank">Политике конфиденциальности</ULink>.
    </div>

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
