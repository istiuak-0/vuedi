import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { router } from './router';
import { vuediPlugin } from 'vuedi';

const app = createApp(App);
app.use(vuediPlugin);
app.use(createPinia());
app.use(router);
app.mount('#app');
