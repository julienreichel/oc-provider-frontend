import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'dashboard',
        component: () => import('pages/DashboardPage.vue'),
      },
      {
        path: 'documents/:id/edit',
        name: 'document-edit',
        component: () => import('pages/DocumentEditPage.vue'),
      },
      {
        path: 'documents/:id/send',
        name: 'document-send',
        component: () => import('pages/DocumentSendPage.vue'),
      },
      {
        path: 'settings',
        name: 'settings',
        component: () => import('pages/SettingsPage.vue'),
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'not-found',
        component: () => import('pages/NotFoundPage.vue'),
      },
    ],
  },
];

export default routes;
