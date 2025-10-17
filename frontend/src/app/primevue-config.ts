import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';

export const primevueConfig = {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.my-app-dark',
    }
  }
}
