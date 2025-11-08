import { describe, it, expect, beforeEach, vi } from 'vitest';
import { defineComponent, h } from 'vue';
import { mount } from '@vue/test-utils';
import { useHealth } from './useHealth';
import { ApiErrorException, ApiErrors } from '../models/ApiError';
import type { Health, Ready } from '../models/Document';

const sampleHealth: Health = {
  status: 'ok',
  timestamp: '2025-11-07T13:45:12.000Z',
};

const sampleReady: Ready = {
  status: 'ready',
  database: 'connected',
};

const createProvider = (): {
  health: ReturnType<typeof vi.fn<() => Promise<Health>>>;
  ready: ReturnType<typeof vi.fn<() => Promise<Ready>>>;
} => {
  const health = vi.fn<() => Promise<Health>>();
  const ready = vi.fn<() => Promise<Ready>>();
  return { health, ready };
};

describe('useHealth', () => {
  let provider: ReturnType<typeof createProvider>;

  beforeEach(() => {
    provider = createProvider();
  });

  it('loads health and readiness status', async () => {
    provider.health.mockResolvedValue(sampleHealth);
    provider.ready.mockResolvedValue(sampleReady);

    const healthComposable = useHealth(provider);
    await healthComposable.check();

    expect(provider.health).toHaveBeenCalled();
    expect(provider.ready).toHaveBeenCalled();
    expect(healthComposable.health.value).toEqual(sampleHealth);
    expect(healthComposable.ready.value).toEqual(sampleReady);
  });

  it('captures errors from provider', async () => {
    const apiError = ApiErrorException.fromApiError(ApiErrors.unavailable('Service unavailable'));
    provider.health.mockRejectedValue(apiError);
    provider.ready.mockResolvedValue(sampleReady);

    const healthComposable = useHealth(provider);
    await healthComposable.check();

    expect(healthComposable.error.value).toEqual(apiError.toApiError());
  });

  it('works inside a component', async () => {
    provider.health.mockResolvedValue(sampleHealth);
    provider.ready.mockResolvedValue(sampleReady);

    const TestComponent = defineComponent({
      setup() {
        const healthComposable = useHealth(provider);
        return { healthComposable };
      },
      render() {
        const status = this.healthComposable.health.value?.status ?? 'unknown';
        return h('div', status);
      },
    });

    const wrapper = mount(TestComponent);
    await wrapper.vm.healthComposable.check();
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toBe('ok');
  });
});
