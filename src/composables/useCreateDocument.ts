import { ref, type Ref } from 'vue';
import type { ApiError } from '../models/ApiError';
import type { DocumentCreate } from '../models/Document';
import { DocumentsHttpProvider } from '../providers/DocumentsHttpProvider';
import { normalizeError } from './utils';

export interface UseCreateDocumentResult {
  creating: Ref<boolean>;
  error: Ref<ApiError | null>;
  create: (payload: DocumentCreate) => Promise<string | undefined>;
}

export const useCreateDocument = (
  provider: Pick<DocumentsHttpProvider, 'create'> = new DocumentsHttpProvider(),
): UseCreateDocumentResult => {
  const creating = ref(false);
  const error = ref<ApiError | null>(null);

  const create = async (payload: DocumentCreate): Promise<string | undefined> => {
    creating.value = true;
    error.value = null;

    try {
      const result = await provider.create(payload);
      return result.id;
    } catch (err) {
      error.value = normalizeError(err);
      return undefined;
    } finally {
      creating.value = false;
    }
  };

  return {
    creating,
    error,
    create,
  };
};
