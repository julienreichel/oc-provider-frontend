import { describe, it, expect, beforeEach, vi } from 'vitest';
import { defineComponent, h } from 'vue';
import { mount } from '@vue/test-utils';
import { useCreateDocument } from './useCreateDocument';
import { ApiErrorException, ApiErrors } from '../models/ApiError';
import type { DocumentCreate } from '../models/Document';

const createProvider = (): {
  create: ReturnType<typeof vi.fn<(payload: DocumentCreate) => Promise<{ id: string }>>>;
} => {
  const create = vi.fn<(payload: DocumentCreate) => Promise<{ id: string }>>();
  return { create };
};

describe('useCreateDocument', () => {
  let provider: ReturnType<typeof createProvider>;

  beforeEach(() => {
    provider = createProvider();
  });

  it('creates a document and returns id', async () => {
    provider.create.mockResolvedValue({ id: 'doc-1' });

    const creator = useCreateDocument(provider);
    const id = await creator.create({ title: 'New doc', content: '...' });

    expect(provider.create).toHaveBeenCalledWith({ title: 'New doc', content: '...' });
    expect(id).toBe('doc-1');
    expect(creator.error.value).toBeNull();
  });

  it('captures errors from provider', async () => {
    const apiError = ApiErrorException.fromApiError(ApiErrors.invalid('Validation failed'));
    provider.create.mockRejectedValue(apiError);

    const creator = useCreateDocument(provider);
    const id = await creator.create({ title: '', content: '' });

    expect(id).toBeUndefined();
    expect(creator.error.value).toEqual(apiError.toApiError());
  });

  it('can be used within components', async () => {
    provider.create.mockResolvedValue({ id: 'doc-1' });

    const TestComponent = defineComponent({
      setup() {
        const creator = useCreateDocument(provider);
        return { creator };
      },
      render() {
        return h('button', { onClick: () => this.creator.create({ title: 'T', content: 'C' }) }, 'Create');
      },
    });

    const wrapper = mount(TestComponent);
    await wrapper.find('button').trigger('click');

    expect(provider.create).toHaveBeenCalledTimes(1);
  });
});
