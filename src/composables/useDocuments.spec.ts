import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useDocuments } from './useDocuments';
import type { CursorPage, Document } from '../models/Document';
import { ApiErrorException, ApiErrors } from '../models/ApiError';
import { defineComponent, h } from 'vue';
import { mount } from '@vue/test-utils';

const samplePage: CursorPage<Document> = {
  items: [
    {
      id: 'doc-1',
      title: 'Doc 1',
      content: 'Content',
      status: 'draft',
      accessCode: null,
      createdAt: '2024-01-01T00:00:00.000Z',
    },
  ],
  nextCursor: 'cursor-1',
};

const createProvider = (): {
  list: ReturnType<typeof vi.fn<(cursor?: string) => Promise<CursorPage<Document>>>>;
} => {
  const list = vi.fn<(cursor?: string) => Promise<CursorPage<Document>>>();
  return { list };
};

describe('useDocuments', () => {
  let provider: ReturnType<typeof createProvider>;

  beforeEach(() => {
    provider = createProvider();
  });

  it('refreshes documents successfully', async () => {
    provider.list.mockResolvedValue(samplePage);

    const documents = useDocuments({ provider });
    await documents.refresh();

    expect(provider.list).toHaveBeenCalledWith(undefined);
    expect(documents.items.value).toEqual(samplePage.items);
    expect(documents.nextCursor.value).toBe(samplePage.nextCursor);
    expect(documents.error.value).toBeNull();
  });

  it('appends next cursor page', async () => {
    provider.list.mockResolvedValueOnce(samplePage).mockResolvedValueOnce({
      items: [
        {
          id: 'doc-2',
          title: 'Doc 2',
          content: 'Content',
          status: 'final',
          accessCode: 'XYZ',
          createdAt: '2024-01-02T00:00:00.000Z',
        },
      ],
      nextCursor: null,
    });

    const documents = useDocuments({ provider });
    await documents.refresh();
    await documents.fetchNext();

    expect(documents.items.value).toHaveLength(2);
    expect(documents.nextCursor.value).toBeNull();
  });

  it('captures errors from provider', async () => {
    const apiError = ApiErrorException.fromApiError(ApiErrors.unknown('Server error'));
    provider.list.mockRejectedValue(apiError);

    const documents = useDocuments({ provider });
    await documents.refresh();

    expect(documents.error.value).toEqual(apiError.toApiError());
  });

  it('ignores stale responses (cancel-safe)', async () => {
    let resolveFirst: ((value: CursorPage<Document>) => void) | undefined;
    const pendingPage = new Promise<CursorPage<Document>>((resolve) => {
      resolveFirst = resolve;
    });
    provider.list.mockImplementationOnce(() => pendingPage).mockResolvedValueOnce(samplePage);

    const documents = useDocuments({ provider });
    const firstRefresh = documents.refresh();
    const secondRefresh = documents.refresh();

    await secondRefresh;
    resolveFirst?.({
      items: [
        {
          id: 'stale',
          title: 'Stale',
          content: 'Old',
          status: 'draft',
          accessCode: null,
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ],
      nextCursor: null,
    });
    await firstRefresh;

    expect(documents.items.value).toEqual(samplePage.items);
  });

  it('updates UI when used inside a component', async () => {
    provider.list.mockResolvedValue(samplePage);

    const TestComponent = defineComponent({
      setup() {
        const documents = useDocuments({ provider });
        return { documents };
      },
      render() {
        return h('div', this.documents.items.value.length);
      },
    });

    const wrapper = mount(TestComponent);
    await wrapper.vm.documents.refresh();
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toBe('1');
  });
});
