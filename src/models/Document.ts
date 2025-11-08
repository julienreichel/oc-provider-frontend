export type DocumentStatus = 'draft' | 'final';

export interface Document {
  id: string;
  title: string;
  content: string;
  status: DocumentStatus;
  accessCode: string | null;
  createdAt: string;
}

export interface DocumentCreate {
  title: string;
  content: string;
  status?: DocumentStatus;
}

export interface DocumentUpdate {
  title?: string;
  content?: string;
  status?: DocumentStatus;
  accessCode?: string | null;
}

export interface CursorPage<T> {
  items: T[];
  nextCursor: string | null;
}

export interface SendRequest {
  documentId: string;
}

export interface SendResult {
  accessCode: string;
}

export interface Health {
  status: 'ok';
  timestamp: string;
}

export interface Ready {
  status: 'ready';
  database: 'connected' | 'disconnected';
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isDocumentStatus = (value: unknown): value is DocumentStatus =>
  value === 'draft' || value === 'final';

export const isDocument = (value: unknown): value is Document => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    typeof value.id === 'string' &&
    typeof value.title === 'string' &&
    typeof value.content === 'string' &&
    typeof value.createdAt === 'string' &&
    isDocumentStatus(value.status) &&
    (typeof value.accessCode === 'string' || value.accessCode === null)
  );
};

export const assertDocument = (payload: unknown, context = 'Document'): Document => {
  if (!isDocument(payload)) {
    throw new Error(`Invalid ${context} payload`);
  }

  return payload;
};

export const isCursorPage = <T>(
  value: unknown,
  itemGuard: (candidate: unknown) => candidate is T,
): value is CursorPage<T> => {
  if (!isRecord(value)) {
    return false;
  }
  if (
    !Array.isArray(value.items) ||
    (typeof value.nextCursor !== 'string' &&
      value.nextCursor !== null &&
      value.nextCursor !== undefined)
  ) {
    return false;
  }

  return value.items.every((item) => itemGuard(item));
};

export const isSendResult = (value: unknown): value is SendResult =>
  isRecord(value) && typeof value.accessCode === 'string';

export const assertSendResult = (payload: unknown): SendResult => {
  if (!isSendResult(payload)) {
    throw new Error('Invalid SendResult payload');
  }

  return payload;
};

export const isHealth = (value: unknown): value is Health =>
  isRecord(value) && value.status === 'ok' && typeof value.timestamp === 'string';

export const isReady = (value: unknown): value is Ready =>
  isRecord(value) &&
  value.status === 'ready' &&
  (value.database === 'connected' || value.database === 'disconnected');
