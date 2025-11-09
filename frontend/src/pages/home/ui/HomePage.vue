<template>
  <div style="padding: 24px; display: flex; flex-direction: column; gap: 24px">
    <!-- Переключатель темы -->
    <div style="display: flex; justify-content: flex-end">
      <!-- <UColorModeSwitch /> -->
       <UColorModeButton />
    </div>

    <!-- Пример кнопок с цветом black -->
    <div style="display: flex; gap: 16px">
      <!-- <UButton color="black" radius="md">Black Button</UButton>
      <UButton color="red" radius="md">Red Button</UButton>
      <UButton color="emerald" radius="md">Emerald Button</UButton> -->
        <UButton color="neutral">Button</UButton>
    </div>
    <p>sdfsdsdf</p>

    <!-- Карточка -->
    <UCard>
      <template #header>
        <div style="font-weight: bold; font-size: 18px">Card Header</div>
      </template>
      <div>
        Card content with NuxtUI theme "Black" example.
      </div>
      <template #footer>
        <span>Card Footer</span>
      </template>
    </UCard>
    <!-- Аватар + иконка -->
    <div style="display: flex; align-items: center; gap: 16px">
      <UAvatar src="https://github.com/nuxt.png" size="lg" />
      <UIcon name="i-lucide-home"/>
      <span>Home Icon & Avatar</span>
    </div>
  </div>
</template>
