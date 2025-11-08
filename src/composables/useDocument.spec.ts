import { describe, it, expect, beforeEach, vi } from 'vitest';
import { defineComponent, h } from 'vue';
import { mount } from '@vue/test-utils';
import { useDocument } from './useDocument';
import type { Document, DocumentUpdate } from '../models/Document';
import { ApiErrorException, ApiErrors } from '../models/ApiError';

const sampleDocument: Document = {
  id: 'doc-1',
  title: 'Doc 1',
  content: 'Content',
  status: 'draft',
  accessCode: null,
  createdAt: '2024-01-01T00:00:00.000Z',
};

const createProvider = (): {
  get: ReturnType<typeof vi.fn<(id: string) => Promise<Document>>>;
  update: ReturnType<typeof vi.fn<(id: string, patch: DocumentUpdate) => Promise<Document>>>;
} => {
  const get = vi.fn<(id: string) => Promise<Document>>();
  const update = vi.fn<(id: string, patch: DocumentUpdate) => Promise<Document>>();
  return { get, update };
};

describe('useDocument', () => {
  let provider: ReturnType<typeof createProvider>;

  beforeEach(() => {
    provider = createProvider();
  });

  it('loads a document', async () => {
    provider.get.mockResolvedValue(sampleDocument);
    const document = useDocument('doc-1', provider);

    await document.load();

    expect(provider.get).toHaveBeenCalledWith('doc-1');
    expect(document.doc.value).toEqual(sampleDocument);
  });

  it('saves a document patch', async () => {
    const updated = { ...sampleDocument, title: 'Updated' };
    provider.update.mockResolvedValue(updated);

    const document = useDocument('doc-1', provider);
    await document.save({ title: 'Updated' });

    expect(provider.update).toHaveBeenCalledWith('doc-1', { title: 'Updated' });
    expect(document.doc.value).toEqual(updated);
  });

  it('handles provider errors', async () => {
    const apiError = ApiErrorException.fromApiError(ApiErrors.notFound('Not found'));
    provider.get.mockRejectedValue(apiError);

    const document = useDocument('doc-404', provider);
    await document.load();

    expect(document.error.value).toEqual(apiError.toApiError());
  });

  it(' updates view layer when used in a component', async () => {
    provider.get.mockResolvedValue(sampleDocument);

    const TestComponent = defineComponent({
      setup() {
        const document = useDocument('doc-1', provider);
        return { document };
      },
      render() {
        return h('div', this.document.doc.value?.title ?? '');
      },
    });

    const wrapper = mount(TestComponent);
    await wrapper.vm.document.load();
    await wrapper.vm.$nextTick();

    expect(wrapper.text()).toBe(sampleDocument.title);
  });
});
