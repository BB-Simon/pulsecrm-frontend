import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { formatPricePerSeat } from '@/features/billing/format'
import type { PlanCatalogEntry } from '@/types/billing'

export function PlanCard({
  plan,
  isCurrent,
  canManageBilling,
  isPending,
  onUpgrade,
}: {
  plan: PlanCatalogEntry
  isCurrent: boolean
  canManageBilling: boolean
  isPending: boolean
  onUpgrade: () => void
}) {
  return (
    <Card className={cn(isCurrent && 'ring-2 ring-ledger')}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{plan.name}</span>
          {isCurrent && (
            <span className="font-mono text-[10px] tracking-wide text-ledger uppercase">
              Current
            </span>
          )}
        </CardTitle>
        <CardDescription>{plan.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="font-mono text-2xl text-ink">
          {formatPricePerSeat(plan.pricePerSeatCents, plan.currency)}
        </p>
        <ul className="flex flex-col gap-1 text-sm text-ink/70">
          <li>Up to {plan.seatLimit.toLocaleString()} seats</li>
          <li>Up to {plan.contactLimit.toLocaleString()} contacts</li>
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          variant={isCurrent ? 'outline' : 'default'}
          disabled={isCurrent || !canManageBilling || isPending}
          onClick={onUpgrade}
        >
          {isCurrent ? 'Current plan' : isPending ? 'Redirecting…' : 'Upgrade'}
        </Button>
      </CardFooter>
    </Card>
  )
}
