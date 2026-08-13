import { z } from 'zod'

export const activityFormSchema = z.object({
  type: z.enum(['CALL', 'EMAIL', 'MEETING', 'NOTE']),
  content: z
    .string()
    .min(1, 'Add a note before logging')
    .max(5000, 'Keep it under 5000 characters'),
})

export type ActivityFormInput = z.infer<typeof activityFormSchema>
