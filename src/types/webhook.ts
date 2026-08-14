export const WEBHOOK_EVENT_TYPES = [
  'deal.won',
  'deal.lost',
  'deal.stage_changed',
  'task.overdue',
  'lead.assigned',
] as const

export type WebhookEventType = (typeof WEBHOOK_EVENT_TYPES)[number]

export interface Webhook {
  id: string
  targetUrl: string
  subscribedEvents: string[]
  isActive: boolean
  createdById: string
  createdAt: string
  updatedAt: string
}

export interface WebhookCreated extends Webhook {
  secret: string
}

export interface WebhookInput {
  targetUrl: string
  subscribedEvents: WebhookEventType[]
  isActive?: boolean
}

export type WebhookDeliveryStatus = 'SUCCESS' | 'FAILED'

export interface WebhookDelivery {
  id: string
  eventType: string
  status: WebhookDeliveryStatus
  responseCode: number | null
  error: string | null
  attempt: number
  deliveredAt: string
}
