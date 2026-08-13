export type DealStatus = 'OPEN' | 'WON' | 'LOST'

export interface PipelineStage {
  id: string
  organizationId: string
  name: string
  order: number
  isWon: boolean
  isLost: boolean
}

export interface Deal {
  id: string
  organizationId: string
  ownerId: string
  contactId: string
  companyId: string | null
  pipelineStageId: string
  title: string
  value: number
  status: DealStatus
  expectedCloseDate: string | null
  closedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface DealInput {
  title: string
  value: number
  contactId: string
  companyId?: string
  pipelineStageId?: string
  expectedCloseDate?: string
  ownerId?: string
}

export interface FollowUpDraft {
  subject: string
  body: string
}

export interface DealSummary {
  summary: string
}
