import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createWebhook,
  deleteWebhook,
  getWebhookDeliveries,
  getWebhooks,
  updateWebhook,
} from '@/features/webhooks/api'
import type { WebhookInput } from '@/types/webhook'

const WEBHOOKS_KEY = ['webhooks']

export function useWebhooks() {
  return useQuery({
    queryKey: WEBHOOKS_KEY,
    queryFn: getWebhooks,
  })
}

export function useCreateWebhook() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: WebhookInput) => createWebhook(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WEBHOOKS_KEY })
    },
  })
}

export function useUpdateWebhook(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: Partial<WebhookInput>) => updateWebhook(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WEBHOOKS_KEY })
    },
  })
}

export function useDeleteWebhook() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteWebhook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WEBHOOKS_KEY })
    },
  })
}

export function useWebhookDeliveries(webhookId: string | undefined) {
  return useQuery({
    queryKey: ['webhooks', webhookId, 'deliveries'],
    queryFn: () => getWebhookDeliveries(webhookId!),
    enabled: Boolean(webhookId),
  })
}
