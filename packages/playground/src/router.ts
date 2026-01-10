import { createRouter, createWebHistory } from 'vue-router';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '',
      component: () => import('./pages/Home.vue'),
    },
    {
      path: '/count',
      component: () => import('./pages/Count.vue'),
    },
    {
      path: '/getter',
      component: () => import('./pages/Getter.vue'),
    },
    {
      path: '/getter-test',
      component: () => import('./pages/getter-test.vue'),
    },
  ],
});
