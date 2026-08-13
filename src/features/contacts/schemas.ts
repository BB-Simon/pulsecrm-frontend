import { z } from 'zod'

export const contactFormSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  email: z
    .union([z.literal(''), z.string().email('Enter a valid email address')])
    .optional(),
  phone: z.string().max(30).optional(),
  companyId: z.string().optional(),
  tags: z.string().optional(),
  ownerId: z.string().optional(),
})

export type ContactFormInput = z.infer<typeof contactFormSchema>
