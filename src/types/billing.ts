export type Plan = 'STARTER' | 'GROWTH' | 'SCALE'

export type SubscriptionStatus =
  | 'TRIALING'
  | 'ACTIVE'
  | 'PAST_DUE'
  | 'CANCELED'
  | 'UNPAID'
  | 'INCOMPLETE'
  | 'INCOMPLETE_EXPIRED'

export interface SubscriptionSummary {
  plan: Plan
  planName: string
  status: SubscriptionStatus
  seatLimit: number
  seatsUsed: number
  contactLimit: number
  contactsUsed: number
  currentPeriodEnd: string | null
  isTrialing: boolean
  isReadOnly: boolean
  hasBillingAccount: boolean
}

export interface PlanCatalogEntry {
  plan: Plan
  name: string
  description: string
  pricePerSeatCents: number
  currency: string
  seatLimit: number
  contactLimit: number
}
