import { z } from 'zod'
import { WEBHOOK_EVENT_TYPES } from '@/types/webhook'

export const webhookFormSchema = z.object({
  targetUrl: z
    .string()
    .url('Enter a valid URL')
    .refine((url) => url.startsWith('https://'), 'Must be an HTTPS URL'),
  subscribedEvents: z
    .array(z.enum(WEBHOOK_EVENT_TYPES))
    .min(1, 'Select at least one event'),
})

export type WebhookFormInput = z.infer<typeof webhookFormSchema>
