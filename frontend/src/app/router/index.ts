import { createRouter, createWebHistory } from 'vue-router';
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
    },
    {
      path: '/registration',
      name: 'registration',
      component: RegistrationPage,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
    },
  ],
});

export default router;
