import { HttpClient } from './HttpClient';
import { assertSendResult, type SendResult } from '../models/Document';
import { ApiErrorException, ApiErrors } from '../models/ApiError';

export class SendHttpProvider {
  constructor(private readonly httpClient: HttpClient = new HttpClient()) {}

  async send(documentId: string): Promise<SendResult> {
    const response = await this.httpClient.post<SendResult>('/send', { documentId });
    return this.ensureSendResult(response);
  }

  private ensureSendResult(payload: unknown): SendResult {
    try {
      return assertSendResult(payload);
    } catch {
      throw ApiErrorException.fromApiError(
        ApiErrors.unknown('Invalid send response from server'),
      );
    }
  }
}
