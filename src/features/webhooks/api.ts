import { apiClient } from '@/lib/api-client'
import type {
  Webhook,
  WebhookCreated,
  WebhookDelivery,
  WebhookInput,
} from '@/types/webhook'
import type { PaginatedResponse } from '@/types/pagination'

export function getWebhooks() {
  return apiClient
    .get<PaginatedResponse<Webhook>>('/webhooks', { params: { limit: 100 } })
    .then((res) => res.data)
}

export function createWebhook(input: WebhookInput) {
  return apiClient
    .post<WebhookCreated>('/webhooks', input)
    .then((res) => res.data)
}

export function updateWebhook(id: string, input: Partial<WebhookInput>) {
  return apiClient
    .patch<Webhook>(`/webhooks/${id}`, input)
    .then((res) => res.data)
}

export function deleteWebhook(id: string) {
  return apiClient.delete(`/webhooks/${id}`).then(() => undefined)
}

export function getWebhookDeliveries(webhookId: string) {
  return apiClient
    .get<PaginatedResponse<WebhookDelivery>>(
      `/webhooks/${webhookId}/deliveries`,
      { params: { limit: 25 } },
    )
    .then((res) => res.data)
}
