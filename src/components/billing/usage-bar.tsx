import { cn } from '@/lib/utils'

export function UsageBar({
  label,
  used,
  limit,
}: {
  label: string
  used: number
  limit: number
}) {
  const percent = limit > 0 ? Math.min(100, (used / limit) * 100) : 0
  const isNearLimit = percent >= 90

  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between text-sm">
        <span className="text-ink/70">{label}</span>
        <span
          className={cn(
            'font-mono text-xs',
            isNearLimit ? 'text-brick' : 'text-ink/50',
          )}
        >
          {used.toLocaleString()} / {limit.toLocaleString()}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-mist">
        <div
          className={cn(
            'h-full rounded-full transition-all',
            isNearLimit ? 'bg-brick' : 'bg-ledger',
          )}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
