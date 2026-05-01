import { createApp } from 'vue';
import { createPinia } from 'pinia';
import VueToastification from 'vue-toastification';
import 'vue-toastification/dist/index.css';

import App from './App.vue';
import router from './router';
import i18n from './locales';
import './assets/styles/main.css';
import { toastOptions } from './utils/toast.config.js';

const app = createApp(App);

// Plugins
app.use(createPinia());
app.use(router);
app.use(i18n);
app.use(VueToastification, toastOptions);

app.mount('#app');
