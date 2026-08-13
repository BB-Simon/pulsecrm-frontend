export type ActivityType = 'CALL' | 'EMAIL' | 'MEETING' | 'NOTE'

export interface Activity {
  id: string
  organizationId: string
  userId: string
  contactId: string | null
  dealId: string | null
  type: ActivityType
  content: string
  occurredAt: string
  createdAt: string
}

export interface ActivityInput {
  type: ActivityType
  content: string
  contactId: string
  dealId?: string
  occurredAt?: string
}
