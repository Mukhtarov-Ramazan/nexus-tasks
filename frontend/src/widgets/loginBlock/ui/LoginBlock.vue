<script setup lang="ts">
const onSubmit = (): void => {
  console.log('Войти в аккаунт');
};
</script>

<template>
  <form class="login-block" @submit="onSubmit">
    <UFormField label="Email">
      <UInput placeholder="Введите почту" type="email" class="w-full" />
    </UFormField>

    <UFormField label="Пароль">
      <UInput placeholder="Введите пароль" type="password" class="w-full" />
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
  </form>
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
