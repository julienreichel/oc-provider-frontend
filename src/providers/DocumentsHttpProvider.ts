import { HttpClient } from './HttpClient';
import type { Document, DocumentCreate, DocumentUpdate, CursorPage } from '../models/Document';
import { assertDocument, isCursorPage, isDocument } from '../models/Document';
import { ApiErrorException, ApiErrors } from '../models/ApiError';

interface DocumentCreateResponse {
  id: string;
}

export class DocumentsHttpProvider {
  constructor(private readonly httpClient: HttpClient = new HttpClient()) {}

  async create(payload: DocumentCreate): Promise<DocumentCreateResponse> {
    const response = await this.httpClient.post<DocumentCreateResponse>('/documents', payload);
    return this.ensureCreateResponse(response);
  }

  async get(id: string): Promise<Document> {
    const response = await this.httpClient.get<Document>(`/documents/${id}`);
    return this.ensureDocument(response, 'Document');
  }

  async update(id: string, patch: DocumentUpdate): Promise<Document> {
    const response = await this.httpClient.put<Document>(`/documents/${id}`, patch);
    return this.ensureDocument(response, 'Document');
  }

  async list(cursor?: string, limit = 20): Promise<CursorPage<Document>> {
    const params = new URLSearchParams();
    params.set('limit', String(limit));
    if (cursor) {
      params.set('cursor', cursor);
    }

    const path = `/documents?${params.toString()}`;
    const response = await this.httpClient.get<CursorPage<Document>>(path);
    return this.ensureCursorPage(response);
  }

  private ensureDocument(payload: unknown, context: string): Document {
    try {
      return assertDocument(payload, context);
    } catch {
      throw ApiErrorException.fromApiError(
        ApiErrors.unknown(`Invalid ${context.toLowerCase()} response from server`),
      );
    }
  }

  private ensureCursorPage(payload: unknown): CursorPage<Document> {
    if (isCursorPage<Document>(payload, isDocument)) {
      return payload;
    }

    throw ApiErrorException.fromApiError(
      ApiErrors.unknown('Invalid document list response from server'),
    );
  }

  private ensureCreateResponse(payload: unknown): DocumentCreateResponse {
    if (payload && typeof payload === 'object' && typeof (payload as { id?: unknown }).id === 'string') {
      return { id: (payload as { id: string }).id };
    }

    throw ApiErrorException.fromApiError(
      ApiErrors.unknown('Invalid create document response from server'),
    );
  }
}
