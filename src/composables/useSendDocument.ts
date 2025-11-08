import { ref, type Ref } from 'vue';
import type { ApiError } from '../models/ApiError';
import { SendHttpProvider } from '../providers/SendHttpProvider';
import type { SendResult } from '../models/Document';
import { normalizeError } from './utils';

export interface UseSendDocumentResult {
  sending: Ref<boolean>;
  error: Ref<ApiError | null>;
  accessCode: Ref<string | null>;
  send: (documentId: string) => Promise<SendResult | undefined>;
}

export const useSendDocument = (
  provider: Pick<SendHttpProvider, 'send'> = new SendHttpProvider(),
): UseSendDocumentResult => {
  const sending = ref(false);
  const error = ref<ApiError | null>(null);
  const accessCode = ref<string | null>(null);

  const send = async (documentId: string): Promise<SendResult | undefined> => {
    sending.value = true;
    error.value = null;

    try {
      const result = await provider.send(documentId);
      accessCode.value = result.accessCode;
      return result;
    } catch (err) {
      accessCode.value = null;
      error.value = normalizeError(err);
      return undefined;
    } finally {
      sending.value = false;
    }
  };

  return {
    sending,
    error,
    accessCode,
    send,
  };
};
