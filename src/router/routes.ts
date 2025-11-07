import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/PublicLayout.vue'),
    children: [
      {
        path: '',
        name: 'access',
        component: () => import('pages/AccessPage.vue'),
      },
      {
        path: 'view/:code',
        name: 'document-view',
        component: () => import('pages/DocumentViewPage.vue'),
      },
    ],
  },

  // Always leave this as last one - catch-all 404
  {
    path: '/:pathMatch(.*)*',
    component: () => import('layouts/PublicLayout.vue'),
    children: [
      {
        path: '',
        name: 'not-found',
        component: () => import('pages/NotFound.vue'),
      },
    ],
  },
];

export default routes;
