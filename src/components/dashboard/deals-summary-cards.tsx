import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/format'
import type { DealsThisMonth } from '@/types/dashboard'

function SummaryCard({
  label,
  count,
  value,
  tone,
}: {
  label: string
  count: number
  value: number
  tone: 'ledger' | 'brick'
}) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-1">
        <span className="text-sm text-ink/50">{label}</span>
        <span
          className={cn(
            'font-mono text-2xl',
            tone === 'ledger' ? 'text-ledger' : 'text-brick',
          )}
        >
          {formatCurrency(value)}
        </span>
        <span className="text-xs text-ink/40">
          {count} {count === 1 ? 'deal' : 'deals'}
        </span>
      </CardContent>
    </Card>
  )
}

export function DealsSummaryCards({ data }: { data: DealsThisMonth }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <SummaryCard
        label="Won this month"
        count={data.won.count}
        value={data.won.value}
        tone="ledger"
      />
      <SummaryCard
        label="Lost this month"
        count={data.lost.count}
        value={data.lost.value}
        tone="brick"
      />
    </div>
  )
}
