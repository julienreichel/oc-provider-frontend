import { ref, type Ref } from 'vue';
import type { ApiError } from '../models/ApiError';
import type { Health, Ready } from '../models/Document';
import { HealthHttpProvider } from '../providers/HealthHttpProvider';
import { normalizeError } from './utils';

export interface UseHealthResult {
  health: Ref<Health | null>;
  ready: Ref<Ready | null>;
  loading: Ref<boolean>;
  error: Ref<ApiError | null>;
  check: () => Promise<void>;
}

export const useHealth = (
  provider: Pick<HealthHttpProvider, 'health' | 'ready'> = new HealthHttpProvider(),
): UseHealthResult => {
  const health = ref<Health | null>(null);
  const ready = ref<Ready | null>(null);
  const loading = ref(false);
  const error = ref<ApiError | null>(null);
  let activeRequestId = 0;

  const check = async (): Promise<void> => {
    const requestId = ++activeRequestId;
    loading.value = true;
    error.value = null;

    try {
      const [healthResult, readyResult] = await Promise.all([provider.health(), provider.ready()]);
      if (requestId !== activeRequestId) {
        return;
      }

      health.value = healthResult;
      ready.value = readyResult;
    } catch (err) {
      if (requestId !== activeRequestId) {
        return;
      }

      error.value = normalizeError(err);
    } finally {
      if (requestId === activeRequestId) {
        loading.value = false;
      }
    }
  };

  return {
    health,
    ready,
    loading,
    error,
    check,
  };
};
