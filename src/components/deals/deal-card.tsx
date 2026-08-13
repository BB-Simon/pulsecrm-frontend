import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/format'
import type { Deal, PipelineStage } from '@/types/deal'

function cornerColorClass(stage?: PipelineStage) {
  if (stage?.isWon) return 'bg-ledger'
  if (stage?.isLost) return 'bg-brick'
  return 'bg-ink/20'
}

export function DealCard({
  deal,
  stage,
  contactName,
  justWon,
  onClick,
}: {
  deal: Deal
  stage?: PipelineStage
  contactName: string
  justWon?: boolean
  onClick?: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: deal.id, data: { deal } })

  const style = transform
    ? { transform: CSS.Translate.toString(transform) }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={cn(
        'group relative cursor-grab touch-none rounded-md border border-mist bg-card p-3 text-left shadow-sm active:cursor-grabbing',
        isDragging && 'z-10 opacity-50',
        justWon && 'ledger-stamp-thump',
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'absolute top-2 right-2 size-2 rounded-xs',
          cornerColorClass(stage),
        )}
      />

      <p className="pr-4 text-sm font-medium text-ink">{deal.title}</p>
      <p className="mt-1 text-xs text-ink/60">{contactName}</p>
      <p className="mt-2 font-mono text-sm text-ink">
        {formatCurrency(deal.value)}
      </p>

      {stage?.isWon && (
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute -top-2 -right-2 rounded-sm border-2 border-ochre px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-wider text-ochre uppercase',
            justWon && 'ledger-stamp-mark',
          )}
          style={{ transform: 'rotate(-8deg)' }}
        >
          Won
        </span>
      )}
    </div>
  )
}
