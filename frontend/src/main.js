import { createApp } from 'vue';
import { createPinia } from 'pinia';
import VueToastification from 'vue-toastification';
import 'vue-toastification/dist/index.css';

import App from './App.vue';
import router from './router';
import i18n from './locales';
import './assets/styles/main.css';

const app = createApp(App);

// Toast options
const toastOptions = {
  position: 'top-right',
  timeout: 3000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: 'button',
  icon: true,
  rtl: false
};

// Plugins
app.use(createPinia());
app.use(router);
app.use(i18n);
app.use(VueToastification, toastOptions);

app.mount('#app');
