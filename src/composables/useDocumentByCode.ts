import { ref } from 'vue';
import { getCurrentProvider } from '../providers/ProviderRegistry';
import type { PublicDocument } from '../models/PublicDocument';
import type { ApiError } from '../models/ApiError';
import { ApiErrors, ApiErrorException } from '../models/ApiError';

/**
 * Composable for loading documents by access code
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function useDocumentByCode() {
  // Reactive state using refs
  const loading = ref(false);
  const data = ref<PublicDocument | undefined>(undefined);
  const error = ref<ApiError | undefined>(undefined);

  // Keep track of the current code for reload functionality
  let currentCode: string | undefined;

  /**
   * Loads a document by access code
   */
  async function load(code: string): Promise<void> {
    // Set loading state and clear previous data/error
    loading.value = true;
    data.value = undefined;
    error.value = undefined;
    currentCode = code;

    try {
      const provider = getCurrentProvider();
      const document = await provider.getByCode(code);

      // Set successful data
      data.value = document;
    } catch (err) {
      // Handle different error types
      if (err instanceof ApiErrorException) {
        // If it's an ApiErrorException, use the contained ApiError
        error.value = {
          code: err.code,
          message: err.message,
        };
      } else if (err instanceof Error) {
        // Convert generic errors to UNAVAILABLE ApiError
        error.value = ApiErrors.unavailable(`Service error: ${err.message}`);
      } else {
        // Handle unknown error types
        error.value = ApiErrors.unavailable('An unknown error occurred');
      }
    } finally {
      loading.value = false;
    }
  }

  /**
   * Reloads the current document using the same code
   */
  async function reload(): Promise<void> {
    if (currentCode) {
      await load(currentCode);
    }
  }

  return {
    state: {
      loading,
      data,
      error,
    },
    load,
    reload,
  };
}
