import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ui from '@nuxt/ui/vue-plugin';

import '@/app/assets/styles/main.css';
import '@/app/assets/styles/variables.css';

import App from './app/App.vue';
import router from './app/router';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(ui);
app.mount('#app');
