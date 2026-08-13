import { apiClient } from '@/lib/api-client'
import type {
  Plan,
  PlanCatalogEntry,
  SubscriptionSummary,
} from '@/types/billing'

export function getSubscription() {
  return apiClient
    .get<SubscriptionSummary>('/billing/subscription')
    .then((res) => res.data)
}

export function getPlans() {
  return apiClient
    .get<PlanCatalogEntry[]>('/billing/plans')
    .then((res) => res.data)
}

export function createCheckoutSession(plan: Plan) {
  return apiClient
    .post<{ url: string; sessionId: string }>('/billing/checkout-session', {
      plan,
    })
    .then((res) => res.data)
}

export function createPortalSession() {
  return apiClient
    .post<{ url: string }>('/billing/portal-session')
    .then((res) => res.data)
}
