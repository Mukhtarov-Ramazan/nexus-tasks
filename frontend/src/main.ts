import { createApp } from 'vue';
import { createPinia } from 'pinia';

import { primevueConfig } from './app/primevue-config';
import PrimeVue from 'primevue/config'

import App from './app/App.vue';
import router from './app/router';

import '@/app/assets/styles/variables.css';
import '@/app/assets/styles/index.scss';
import 'primeicons/primeicons.css';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(PrimeVue, primevueConfig);

app.mount('#app');
