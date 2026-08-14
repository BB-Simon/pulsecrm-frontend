import { z } from 'zod'

export const apiKeyFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
})

export type ApiKeyFormInput = z.infer<typeof apiKeyFormSchema>
