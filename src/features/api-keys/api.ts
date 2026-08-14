import { apiClient } from '@/lib/api-client'
import type { ApiKey, ApiKeyCreated, ApiKeyInput } from '@/types/api-key'
import type { PaginatedResponse } from '@/types/pagination'

export function getApiKeys() {
  return apiClient
    .get<PaginatedResponse<ApiKey>>('/api-keys', { params: { limit: 100 } })
    .then((res) => res.data)
}

export function createApiKey(input: ApiKeyInput) {
  return apiClient
    .post<ApiKeyCreated>('/api-keys', input)
    .then((res) => res.data)
}

export function revokeApiKey(id: string) {
  return apiClient
    .post<ApiKey>(`/api-keys/${id}/revoke`)
    .then((res) => res.data)
}
