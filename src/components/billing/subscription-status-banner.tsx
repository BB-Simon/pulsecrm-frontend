import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { daysUntil, formatDate } from '@/features/billing/format'
import type { SubscriptionSummary } from '@/types/billing'

const STATUS_LABEL: Record<SubscriptionSummary['status'], string> = {
  TRIALING: 'Trialing',
  ACTIVE: 'Active',
  PAST_DUE: 'Past due',
  CANCELED: 'Canceled',
  UNPAID: 'Unpaid',
  INCOMPLETE: 'Incomplete',
  INCOMPLETE_EXPIRED: 'Incomplete',
}

function StatusBadge({ status }: { status: SubscriptionSummary['status'] }) {
  const classesByStatus: Record<SubscriptionSummary['status'], string> = {
    TRIALING: 'bg-ochre/15 text-ochre',
    ACTIVE: 'bg-ledger/10 text-ledger',
    PAST_DUE: 'bg-brick/10 text-brick',
    CANCELED: 'bg-brick/10 text-brick',
    UNPAID: 'bg-brick/10 text-brick',
    INCOMPLETE: 'bg-mist text-ink/60',
    INCOMPLETE_EXPIRED: 'bg-mist text-ink/60',
  }

  return (
    <Badge
      variant="outline"
      className={cn('border-0', classesByStatus[status])}
    >
      {STATUS_LABEL[status]}
    </Badge>
  )
}

export function SubscriptionStatusBanner({
  subscription,
}: {
  subscription: SubscriptionSummary
}) {
  const isRestricted = subscription.isReadOnly

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-3 rounded-md border px-5 py-4',
        isRestricted ? 'border-brick/30 bg-brick/5' : 'border-border bg-card',
      )}
    >
      <div className="flex items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-heading text-lg text-ink">
              {subscription.planName} plan
            </span>
            <StatusBadge status={subscription.status} />
          </div>
          <p className="mt-1 text-sm text-ink/60">
            {subscription.isTrialing && subscription.currentPeriodEnd && (
              <>
                Trial ends {formatDate(subscription.currentPeriodEnd)} ·{' '}
                <span className="font-mono">
                  {daysUntil(subscription.currentPeriodEnd)}
                </span>{' '}
                days left
              </>
            )}
            {subscription.status === 'ACTIVE' &&
              subscription.currentPeriodEnd && (
                <>Renews {formatDate(subscription.currentPeriodEnd)}</>
              )}
            {subscription.status === 'PAST_DUE' &&
              'Your last payment failed. Update your payment method to avoid losing access.'}
            {subscription.status === 'CANCELED' &&
              'Your subscription has ended. The organization is in read-only mode until you resubscribe.'}
            {(subscription.status === 'UNPAID' ||
              subscription.status === 'INCOMPLETE' ||
              subscription.status === 'INCOMPLETE_EXPIRED') &&
              'There is a problem with your billing. Please update your payment details.'}
          </p>
        </div>
      </div>
    </div>
  )
}
