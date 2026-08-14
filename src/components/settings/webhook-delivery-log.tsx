import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useWebhookDeliveries } from '@/features/webhooks/hooks'
import { getApiErrorMessage } from '@/lib/errors'
import { formatDateTime } from '@/lib/format'
import { cn } from '@/lib/utils'

export function WebhookDeliveryLog({ webhookId }: { webhookId: string }) {
  const deliveriesQuery = useWebhookDeliveries(webhookId)

  return (
    <div>
      {deliveriesQuery.isPending && (
        <div className="flex flex-col gap-2 p-3">
          <Skeleton className="h-5 w-full" />
          <Skeleton className="h-5 w-full" />
        </div>
      )}

      {deliveriesQuery.isError && (
        <p className="p-3 text-sm text-brick">
          {getApiErrorMessage(
            deliveriesQuery.error,
            'Unable to load delivery log.',
          )}
        </p>
      )}

      {deliveriesQuery.data?.data.length === 0 && (
        <p className="p-3 text-sm text-ink/40">No deliveries yet.</p>
      )}

      {deliveriesQuery.data && deliveriesQuery.data.data.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Event</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Response</TableHead>
              <TableHead>Attempt</TableHead>
              <TableHead>Delivered</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deliveriesQuery.data.data.map((delivery) => (
              <TableRow key={delivery.id}>
                <TableCell className="font-mono text-xs">
                  {delivery.eventType}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={cn(
                      'border-0',
                      delivery.status === 'SUCCESS'
                        ? 'bg-ledger/10 text-ledger'
                        : 'bg-brick/10 text-brick',
                    )}
                  >
                    {delivery.status}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-xs text-ink/70">
                  {delivery.responseCode ?? (
                    <span title={delivery.error ?? undefined}>
                      {delivery.error ? 'Error' : '—'}
                    </span>
                  )}
                </TableCell>
                <TableCell className="font-mono text-xs text-ink/50">
                  {delivery.attempt}
                </TableCell>
                <TableCell className="font-mono text-xs text-ink/50">
                  {formatDateTime(delivery.deliveredAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  )
}
