import { describe, it, expect } from 'vitest';
import type { RouteRecordRaw } from 'vue-router';
import routes from './routes';

const getMainLayout = () => routes.find((route) => route.path === '/');

describe('app router map', () => {
  it('exposes provider workspace routes behind MainLayout', () => {
    const mainLayout = getMainLayout();
    expect(mainLayout).toBeDefined();
    expect(mainLayout?.children).toBeDefined();

    const childRouteNames = (mainLayout?.children ?? []).map((route) => route.name);
    expect(childRouteNames).toEqual(
      expect.arrayContaining(['dashboard', 'document-edit', 'document-send', 'settings']),
    );

    const editRoute = mainLayout?.children?.find(
      (route: RouteRecordRaw) => route.path === 'documents/:id/edit',
    );
    expect(editRoute).toBeDefined();
    expect(editRoute?.props).toBeUndefined(); // route params are read via useRoute
  });

  it('defines Dashboard as the default child route', () => {
    const mainLayout = getMainLayout();
    const dashboard = mainLayout?.children?.find((route) => route.path === '');
    expect(dashboard?.name).toBe('dashboard');
  });

  it('maps catch-all paths to the NotFound page', () => {
    const notFoundRoute = routes.find(
      (route) => route.path === '/:catchAll(.*)*' || route.path === '/:pathMatch(.*)*',
    );

    expect(notFoundRoute).toBeDefined();
    expect(notFoundRoute?.children?.[0]?.name).toBe('not-found');
  });
});
