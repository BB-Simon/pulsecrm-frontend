import { useMutation, useQuery } from '@tanstack/react-query'
import {
  createCheckoutSession,
  createPortalSession,
  getPlans,
  getSubscription,
} from '@/features/billing/api'

export function useSubscription() {
  return useQuery({
    queryKey: ['billing', 'subscription'],
    queryFn: getSubscription,
  })
}

export function usePlans() {
  return useQuery({
    queryKey: ['billing', 'plans'],
    queryFn: getPlans,
  })
}

export function useCheckoutSession() {
  return useMutation({
    mutationFn: createCheckoutSession,
    onSuccess: (data) => {
      window.location.href = data.url
    },
  })
}

export function usePortalSession() {
  return useMutation({
    mutationFn: createPortalSession,
    onSuccess: (data) => {
      window.location.href = data.url
    },
  })
}
