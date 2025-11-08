import { describe, it, expect, beforeEach, vi } from 'vitest';
import { defineComponent, h } from 'vue';
import { mount } from '@vue/test-utils';
import { useSendDocument } from './useSendDocument';
import { ApiErrorException, ApiErrors } from '../models/ApiError';

const createProvider = (): {
  send: ReturnType<typeof vi.fn<(documentId: string) => Promise<{ accessCode: string }>>>;
} => {
  const send = vi.fn<(documentId: string) => Promise<{ accessCode: string }>>();
  return { send };
};

describe('useSendDocument', () => {
  let provider: ReturnType<typeof createProvider>;

  beforeEach(() => {
    provider = createProvider();
  });

  it('sends a document and stores access code', async () => {
    provider.send.mockResolvedValue({ accessCode: 'ABC123' });

    const sender = useSendDocument(provider);
    const result = await sender.send('doc-1');

    expect(provider.send).toHaveBeenCalledWith('doc-1');
    expect(result).toEqual({ accessCode: 'ABC123' });
    expect(sender.accessCode.value).toBe('ABC123');
  });

  it('captures send errors', async () => {
    const apiError = ApiErrorException.fromApiError(ApiErrors.invalid('Invalid state'));
    provider.send.mockRejectedValue(apiError);

    const sender = useSendDocument(provider);
    const result = await sender.send('doc-1');

    expect(result).toBeUndefined();
    expect(sender.error.value).toEqual(apiError.toApiError());
    expect(sender.accessCode.value).toBeNull();
  });

  it('hooks into component state', async () => {
    provider.send.mockResolvedValue({ accessCode: 'ABC123' });

    const TestComponent = defineComponent({
      setup() {
        const sender = useSendDocument(provider);
        return { sender };
      },
      render() {
        return h('button', { onClick: () => this.sender.send('doc-1') }, 'Send');
      },
    });

    const wrapper = mount(TestComponent);
    await wrapper.find('button').trigger('click');

    expect(provider.send).toHaveBeenCalledTimes(1);
  });
});
