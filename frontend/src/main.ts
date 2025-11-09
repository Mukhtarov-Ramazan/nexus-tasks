import '@/app/assets/styles/main.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ui from '@nuxt/ui/vue-plugin';

import App from './app/App.vue';
import router from './app/router';

import '@/app/assets/styles/variables.css';
// import '@/app/assets/styles/index.scss';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(ui);
app.mount('#app');
