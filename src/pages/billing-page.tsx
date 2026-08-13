import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/stores/auth-store'
import {
  useCheckoutSession,
  usePlans,
  usePortalSession,
  useSubscription,
} from '@/features/billing/hooks'
import { SubscriptionStatusBanner } from '@/components/billing/subscription-status-banner'
import { UsageBar } from '@/components/billing/usage-bar'
import { PlanCard } from '@/components/billing/plan-card'
import { getApiErrorMessage } from '@/lib/errors'

export function BillingPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const queryClient = useQueryClient()
  const role = useAuthStore((state) => state.user?.role)
  const isAdmin = role === 'ADMIN'

  const subscriptionQuery = useSubscription()
  const plansQuery = usePlans()
  const checkoutMutation = useCheckoutSession()
  const portalMutation = usePortalSession()

  const checkoutResult = searchParams.get('checkout')

  useEffect(() => {
    if (checkoutResult === 'success') {
      queryClient.invalidateQueries({ queryKey: ['billing', 'subscription'] })
    }
  }, [checkoutResult, queryClient])

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <h1 className="font-heading text-2xl text-ink">Billing</h1>

      {checkoutResult && (
        <div
          className="flex items-center justify-between rounded-md border border-border bg-card px-4 py-3 text-sm"
          role="status"
        >
          <span>
            {checkoutResult === 'success'
              ? 'Checkout complete — your plan will update shortly.'
              : 'Checkout was cancelled. No changes were made.'}
          </span>
          <button
            type="button"
            onClick={() => setSearchParams({}, { replace: true })}
            className="text-ink/50 hover:text-ink"
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      )}

      {subscriptionQuery.isPending && (
        <p className="text-sm text-ink/60">Loading billing details…</p>
      )}

      {subscriptionQuery.isError && (
        <p className="text-sm text-brick">
          {getApiErrorMessage(
            subscriptionQuery.error,
            'Unable to load billing details.',
          )}
        </p>
      )}

      {subscriptionQuery.data && (
        <>
          <SubscriptionStatusBanner subscription={subscriptionQuery.data} />

          <Card>
            <CardHeader>
              <CardTitle>Usage</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <UsageBar
                label="Seats"
                used={subscriptionQuery.data.seatsUsed}
                limit={subscriptionQuery.data.seatLimit}
              />
              <UsageBar
                label="Contacts"
                used={subscriptionQuery.data.contactsUsed}
                limit={subscriptionQuery.data.contactLimit}
              />

              {isAdmin ? (
                <Button
                  variant="outline"
                  className="w-fit"
                  disabled={
                    !subscriptionQuery.data.hasBillingAccount ||
                    portalMutation.isPending
                  }
                  onClick={() => portalMutation.mutate()}
                >
                  {portalMutation.isPending
                    ? 'Opening billing portal…'
                    : 'Manage billing'}
                </Button>
              ) : (
                <p className="text-xs text-ink/50">
                  Only admins can manage billing.
                </p>
              )}

              {!subscriptionQuery.data.hasBillingAccount && isAdmin && (
                <p className="text-xs text-ink/50">
                  Subscribe to a plan below to set up billing.
                </p>
              )}

              {portalMutation.isError && (
                <p className="text-xs text-brick">
                  {getApiErrorMessage(
                    portalMutation.error,
                    'Unable to open the billing portal.',
                  )}
                </p>
              )}
            </CardContent>
          </Card>

          <div>
            <h2 className="mb-3 font-heading text-lg text-ink">Plans</h2>
            {plansQuery.isPending && (
              <p className="text-sm text-ink/60">Loading plans…</p>
            )}
            {plansQuery.data && (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {plansQuery.data.map((plan) => (
                  <PlanCard
                    key={plan.plan}
                    plan={plan}
                    isCurrent={plan.plan === subscriptionQuery.data.plan}
                    canManageBilling={isAdmin}
                    isPending={
                      checkoutMutation.isPending &&
                      checkoutMutation.variables === plan.plan
                    }
                    onUpgrade={() => checkoutMutation.mutate(plan.plan)}
                  />
                ))}
              </div>
            )}
            {checkoutMutation.isError && (
              <p className="mt-3 text-xs text-brick">
                {getApiErrorMessage(
                  checkoutMutation.error,
                  'Unable to start checkout.',
                )}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  )
}
