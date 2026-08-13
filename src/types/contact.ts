export interface Contact {
  id: string
  organizationId: string
  ownerId: string
  companyId: string | null
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
  tags: string[]
  leadScore: number | null
  leadScoreRationale: string | null
  leadScoredAt: string | null
  createdAt: string
  updatedAt: string
}

export interface ContactListQuery {
  page?: number
  limit?: number
  search?: string
  tag?: string
  ownerId?: string
}

export interface ContactInput {
  firstName: string
  lastName: string
  email?: string
  phone?: string
  companyId?: string
  tags?: string[]
  ownerId?: string
}

export interface LeadScore {
  score: number
  rationale: string
  scoredAt: string
}
