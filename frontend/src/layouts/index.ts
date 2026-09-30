import AuthLayout from './AuthLayout.vue';
import DefaultLayout from './DefaultLayout.vue';

export const layouts = {
  default: DefaultLayout,
  auth: AuthLayout,
} as const;
