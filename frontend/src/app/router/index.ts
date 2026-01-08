import { createRouter, createWebHistory } from 'vue-router';
import AuthLayout from '@/layouts/AuthLayout.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import { HomePage } from '@/pages/home';
import { RegistrationPage } from '@/pages/auth';
import { LoginPage } from '@/pages/login';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
      meta: { layout: DefaultLayout },
    },
    {
      path: '/registration',
      name: 'registration',
      component: RegistrationPage,
      meta: { layout: AuthLayout },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
      meta: { layout: AuthLayout },
    },
  ],
});

export default router;
