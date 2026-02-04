import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import { router } from './router';
import { iocraft } from 'iocraft';
const app = createApp(App);
app.use(router);
app.use(iocraft, {
  router,
});
app.use(createPinia());
app.mount('#app');
