import { ref, type Ref } from 'vue';
import type { Document, DocumentUpdate } from '../models/Document';
import type { ApiError } from '../models/ApiError';
import { DocumentsHttpProvider } from '../providers/DocumentsHttpProvider';
import { normalizeError } from './utils';

export interface UseDocumentResult {
  doc: Ref<Document | null>;
  loading: Ref<boolean>;
  error: Ref<ApiError | null>;
  load: () => Promise<void>;
  save: (patch: DocumentUpdate) => Promise<void>;
}

export const useDocument = (
  id: string,
  provider: Pick<DocumentsHttpProvider, 'get' | 'update'> = new DocumentsHttpProvider(),
): UseDocumentResult => {
  const doc = ref<Document | null>(null);
  const loading = ref(false);
  const error = ref<ApiError | null>(null);

  let activeRequestId = 0;

  const load = async (): Promise<void> => {
    const requestId = ++activeRequestId;
    loading.value = true;
    error.value = null;

    try {
      const result = await provider.get(id);
      if (requestId !== activeRequestId) {
        return;
      }
      doc.value = result;
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

  const save = async (patch: DocumentUpdate): Promise<void> => {
    const requestId = ++activeRequestId;
    loading.value = true;
    error.value = null;

    try {
      const result = await provider.update(id, patch);
      if (requestId !== activeRequestId) {
        return;
      }

      doc.value = result;
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
    doc,
    loading,
    error,
    load,
    save,
  };
};
