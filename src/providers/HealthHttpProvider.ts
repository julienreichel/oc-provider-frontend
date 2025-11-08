import { HttpClient } from './HttpClient';
import type { Health, Ready } from '../models/Document';
import { isHealth, isReady } from '../models/Document';
import { ApiErrorException, ApiErrors } from '../models/ApiError';

export class HealthHttpProvider {
  constructor(private readonly httpClient: HttpClient = new HttpClient()) {}

  async health(): Promise<Health> {
    const response = await this.httpClient.get<Health>('/health');
    if (isHealth(response)) {
      return response;
    }

    throw ApiErrorException.fromApiError(ApiErrors.unknown('Invalid health payload'));
  }

  async ready(): Promise<Ready> {
    const response = await this.httpClient.get<Ready>('/ready');
    if (isReady(response)) {
      return response;
    }

    throw ApiErrorException.fromApiError(ApiErrors.unknown('Invalid readiness payload'));
  }
}
