import { useDroppable } from '@dnd-kit/core'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/format'
import { DealCard } from '@/components/deals/deal-card'
import type { Deal, PipelineStage } from '@/types/deal'

export function PipelineColumn({
  stage,
  deals,
  contactNameById,
  justWonDealId,
  onSelectDeal,
}: {
  stage: PipelineStage
  deals: Deal[]
  contactNameById: Map<string, string>
  justWonDealId: string | null
  onSelectDeal: (dealId: string) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage.id })
  const total = deals.reduce((sum, deal) => sum + deal.value, 0)

  return (
    <div className="flex w-72 shrink-0 flex-col">
      <div className="mb-2 flex items-baseline justify-between px-1">
        <h2 className="font-mono text-xs tracking-wider text-ink/60 uppercase">
          {stage.name}
        </h2>
        <span className="font-mono text-xs text-ink/40">
          {formatCurrency(total)}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className={cn(
          'flex min-h-24 flex-1 flex-col gap-2 rounded-md border border-mist bg-mist/20 p-2 transition-colors',
          isOver && 'border-ochre bg-ochre/5',
        )}
      >
        {deals.length === 0 && (
          <p className="px-1 py-6 text-center text-xs text-ink/30">No deals</p>
        )}
        {deals.map((deal) => (
          <DealCard
            key={deal.id}
            deal={deal}
            stage={stage}
            contactName={
              contactNameById.get(deal.contactId) ?? 'Unknown contact'
            }
            justWon={deal.id === justWonDealId}
            onClick={() => onSelectDeal(deal.id)}
          />
        ))}
      </div>
    </div>
  )
}
