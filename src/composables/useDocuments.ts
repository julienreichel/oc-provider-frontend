import { ref, type Ref } from 'vue';
import type { Document, CursorPage } from '../models/Document';
import type { ApiError } from '../models/ApiError';
import { DocumentsHttpProvider } from '../providers/DocumentsHttpProvider';
import { normalizeError } from './utils';

export interface UseDocumentsOptions {
  provider?: Pick<DocumentsHttpProvider, 'list'>;
}

export interface UseDocumentsResult {
  items: Ref<Document[]>;
  nextCursor: Ref<string | null>;
  loading: Ref<boolean>;
  error: Ref<ApiError | null>;
  refresh: () => Promise<void>;
  fetchNext: () => Promise<void>;
}

export const useDocuments = (options: UseDocumentsOptions = {}): UseDocumentsResult => {
  const provider = options.provider ?? new DocumentsHttpProvider();

  const items = ref<Document[]>([]);
  const nextCursor = ref<string | null>(null);
  const loading = ref(false);
  const error = ref<ApiError | null>(null);

  let activeRequestId = 0;

  const loadPage = async (cursor?: string, append = false): Promise<void> => {
    const requestId = ++activeRequestId;
    loading.value = true;
    error.value = null;

    try {
      const page = await provider.list(cursor);
      if (requestId !== activeRequestId) {
        return;
      }

      applyPage(page, append);
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

  const applyPage = (page: CursorPage<Document>, append: boolean): void => {
    items.value = append ? [...items.value, ...page.items] : [...page.items];
    nextCursor.value = page.nextCursor;
  };

  const refresh = (): Promise<void> => loadPage(undefined, false);

  const fetchNext = (): Promise<void> => {
    if (!nextCursor.value || loading.value) {
      return Promise.resolve();
    }

    return loadPage(nextCursor.value, true);
  };

  return {
    items,
    nextCursor,
    loading,
    error,
    refresh,
    fetchNext,
  };
};
