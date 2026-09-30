import { createRouter, createWebHistory } from 'vue-router';
import { ROUTES } from '@/shared/config';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: ROUTES.home,
      name: 'home',
      component: () => import('@/pages/home').then(m => m.HomePage),
      meta: { layout: 'default' },
    },
    {
      path: ROUTES.registration,
      name: 'registration',
      component: () => import('@/pages/registration').then(m => m.RegistrationPage),
      meta: { layout: 'auth' },
    },
    {
      path: ROUTES.login,
      name: 'login',
      component: () => import('@/pages/login').then(m => m.LoginPage),
      meta: { layout: 'auth' },
    },
  ],
});

export default router;
