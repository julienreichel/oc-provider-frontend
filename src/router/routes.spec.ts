import { describe, it, expect } from 'vitest';
import type { RouteRecordRaw } from 'vue-router';
import routes from './routes';

describe('Router Routes', () => {
  it('should define the correct number of routes', () => {
    // We expect: MainLayout with children + catch-all 404
    expect(routes).toHaveLength(2);
  });

  it('should define main layout route with children', () => {
    const mainLayout = routes[0];
    expect(mainLayout).toBeDefined();
    expect(mainLayout?.path).toBe('/');
    expect(mainLayout?.component).toBeDefined();
    expect(mainLayout?.children).toBeDefined();
  });

  it('should define access route', () => {
    const mainLayout = routes[0];
    expect(mainLayout).toBeDefined();

    if (mainLayout?.children) {
      const accessRoute = mainLayout.children.find((route: RouteRecordRaw) => route.path === '');
      expect(accessRoute).toBeDefined();
      expect(accessRoute?.name).toBe('access');
      expect(accessRoute?.component).toBeDefined();
    }
  });

  it('should define document view route with code parameter', () => {
    const mainLayout = routes[0];
    expect(mainLayout).toBeDefined();

    if (mainLayout?.children) {
      const viewRoute = mainLayout.children.find(
        (route: RouteRecordRaw) => route.path === 'view/:code',
      );
      expect(viewRoute).toBeDefined();
      expect(viewRoute?.name).toBe('document-view');
      expect(viewRoute?.component).toBeDefined();
    }
  });

  it('should define catch-all 404 route', () => {
    const notFoundRoute = routes.find((route: RouteRecordRaw) => route.path === '/:pathMatch(.*)*');

    expect(notFoundRoute).toBeDefined();
    expect(notFoundRoute?.component).toBeDefined();
    expect(notFoundRoute?.children).toBeDefined();
    expect(notFoundRoute?.children?.[0]?.name).toBe('not-found');
    expect(notFoundRoute?.children?.[0]?.component).toBeDefined();
  });

  it('should have proper route names for navigation', () => {
    const mainLayout = routes[0];
    expect(mainLayout).toBeDefined();

    if (mainLayout?.children) {
      const childRouteNames = mainLayout.children.map((route: RouteRecordRaw) => route.name);
      expect(childRouteNames).toContain('access');
      expect(childRouteNames).toContain('document-view');
    }

    const catchAllRoute = routes.find((route: RouteRecordRaw) => route.path === '/:pathMatch(.*)*');
    expect(catchAllRoute?.children?.[0]?.name).toBe('not-found');
  });
});
