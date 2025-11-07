import { describe, it, expect, beforeEach } from 'vitest';
import { createMemoryHistory, createRouter } from 'vue-router';
import routes from './routes';

const createTestRouter = (): ReturnType<typeof createRouter> =>
  createRouter({
    history: createMemoryHistory(),
    routes,
  });

describe('router navigation', () => {
  let router: ReturnType<typeof createTestRouter>;

  beforeEach(() => {
    router = createTestRouter();
  });

  it('navigates between provider workspace routes', async () => {
    await router.push('/');
    await router.isReady();

    expect(router.currentRoute.value.name).toBe('dashboard');

    await router.push('/documents/42/edit');
    expect(router.currentRoute.value.name).toBe('document-edit');
    expect(router.currentRoute.value.params.id).toBe('42');

    await router.push('/documents/42/send');
    expect(router.currentRoute.value.name).toBe('document-send');

    await router.push('/settings');
    expect(router.currentRoute.value.name).toBe('settings');
  });

  it('falls back to NotFound for unknown paths', async () => {
    await router.push('/does-not-exist');
    await router.isReady();

    expect(router.currentRoute.value.name).toBe('not-found');
  });
});
