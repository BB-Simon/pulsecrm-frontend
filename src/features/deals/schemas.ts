import { z } from 'zod'

export const dealFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  value: z.number().min(0, 'Value must be 0 or more'),
  contactId: z.string().min(1, 'Select a contact'),
  pipelineStageId: z.string().min(1, 'Select a stage'),
  expectedCloseDate: z.string().optional(),
  ownerId: z.string().optional(),
})

export type DealFormInput = z.infer<typeof dealFormSchema>
