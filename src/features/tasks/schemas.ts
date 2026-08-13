import { z } from 'zod'

export const taskFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(5000).optional(),
  dueDate: z.string().min(1, 'Due date is required'),
  contactId: z.string().optional(),
  assigneeId: z.string().optional(),
})

export type TaskFormInput = z.infer<typeof taskFormSchema>
