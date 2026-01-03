import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import { vuedi } from '@vuedi/core';

const app = createApp(App);

app.use(vuedi, {
  services: [],
});

app.use(createPinia());

app.mount('#app');
