import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createWebHistory } from 'vue-router';
import App from './App.vue';
import { i18n } from './i18n';

// Mock router
const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: { template: '<div>{{ $t("app.title") }}</div>' },
    },
  ],
});

describe('App.vue', () => {
  it('renders without errors', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [router, i18n],
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it('provides i18n globally', async () => {
    // Navigate to home route first
    await router.push('/');
    await router.isReady();

    mount(App, {
      global: {
        plugins: [router, i18n],
      },
    });

    // Check that i18n is available by testing translation
    expect(i18n.global.t('app.title')).toBe('Document Viewer');
  });

  it('renders router-view content', async () => {
    await router.push('/');
    await router.isReady();

    const wrapper = mount(App, {
      global: {
        plugins: [router, i18n],
      },
    });

    // The router-view should render the matched route component
    expect(wrapper.html()).toContain('Document Viewer');
  });
});
