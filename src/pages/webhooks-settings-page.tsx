import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Pencil, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  useDeleteWebhook,
  useUpdateWebhook,
  useWebhooks,
} from '@/features/webhooks/hooks'
import { WebhookFormDialog } from '@/components/settings/webhook-form-dialog'
import { WebhookDeliveryLog } from '@/components/settings/webhook-delivery-log'
import { useAuthStore } from '@/stores/auth-store'
import { getApiErrorMessage } from '@/lib/errors'
import { cn } from '@/lib/utils'
import type { Webhook } from '@/types/webhook'

function WebhookRow({
  webhook,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
}: {
  webhook: Webhook
  isSelected: boolean
  onSelect: () => void
  onEdit: () => void
  onDelete: () => void
}) {
  const toggleActiveMutation = useUpdateWebhook(webhook.id)

  return (
    <TableRow
      className={cn('cursor-pointer', isSelected && 'bg-muted')}
      onClick={onSelect}
    >
      <TableCell className="max-w-64 truncate font-mono text-xs">
        {webhook.targetUrl}
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {webhook.subscribedEvents.map((event) => (
            <Badge
              key={event}
              variant="secondary"
              className="font-mono text-[10px]"
            >
              {event}
            </Badge>
          ))}
        </div>
      </TableCell>
      <TableCell>
        <Badge
          variant="outline"
          className={cn(
            'border-0',
            webhook.isActive
              ? 'bg-ledger/10 text-ledger'
              : 'bg-mist text-ink/50',
          )}
        >
          {webhook.isActive ? 'Active' : 'Paused'}
        </Badge>
      </TableCell>
      <TableCell onClick={(event) => event.stopPropagation()}>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-ink/50"
            disabled={toggleActiveMutation.isPending}
            onClick={() =>
              toggleActiveMutation.mutate({ isActive: !webhook.isActive })
            }
          >
            {webhook.isActive ? 'Pause' : 'Resume'}
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={onEdit}>
            <Pencil className="size-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-brick hover:bg-brick/10 hover:text-brick"
            onClick={onDelete}
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
}

export function WebhooksSettingsPage() {
  const role = useAuthStore((state) => state.user?.role)
  const webhooksQuery = useWebhooks()
  const deleteMutation = useDeleteWebhook()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingWebhook, setEditingWebhook] = useState<Webhook | undefined>()
  const [deletingWebhook, setDeletingWebhook] = useState<Webhook | undefined>()
  const [selectedWebhookId, setSelectedWebhookId] = useState<string | null>(
    null,
  )

  if (role !== 'ADMIN') {
    return (
      <div className="flex max-w-2xl flex-col gap-4">
        <Link
          to="/settings"
          className="flex w-fit items-center gap-1.5 text-sm text-ink/50 hover:text-ink"
        >
          <ArrowLeft className="size-3.5" />
          Settings
        </Link>
        <p className="text-sm text-ink/50">Only admins can manage webhooks.</p>
      </div>
    )
  }

  const selectedWebhook = webhooksQuery.data?.data.find(
    (w) => w.id === selectedWebhookId,
  )

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <Link
        to="/settings"
        className="flex w-fit items-center gap-1.5 text-sm text-ink/50 hover:text-ink"
      >
        <ArrowLeft className="size-3.5" />
        Settings
      </Link>

      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl text-ink">Webhooks</h1>
        <Button
          onClick={() => {
            setEditingWebhook(undefined)
            setIsFormOpen(true)
          }}
        >
          <Plus className="size-4" />
          New webhook
        </Button>
      </div>

      {webhooksQuery.isError && (
        <p className="text-sm text-brick">
          {getApiErrorMessage(webhooksQuery.error, 'Unable to load webhooks.')}
        </p>
      )}

      {webhooksQuery.isPending && (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      )}

      {webhooksQuery.data && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Target URL</TableHead>
              <TableHead>Events</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {webhooksQuery.data.data.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-10 text-center text-sm text-ink/50"
                >
                  No webhooks configured.
                </TableCell>
              </TableRow>
            )}
            {webhooksQuery.data.data.map((webhook) => (
              <WebhookRow
                key={webhook.id}
                webhook={webhook}
                isSelected={webhook.id === selectedWebhookId}
                onSelect={() =>
                  setSelectedWebhookId((current) =>
                    current === webhook.id ? null : webhook.id,
                  )
                }
                onEdit={() => {
                  setEditingWebhook(webhook)
                  setIsFormOpen(true)
                }}
                onDelete={() => setDeletingWebhook(webhook)}
              />
            ))}
          </TableBody>
        </Table>
      )}

      {selectedWebhook && (
        <Card>
          <CardHeader>
            <CardTitle>Delivery log</CardTitle>
            <p className="font-mono text-xs text-ink/40">
              {selectedWebhook.targetUrl}
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <WebhookDeliveryLog webhookId={selectedWebhook.id} />
          </CardContent>
        </Card>
      )}

      <WebhookFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        webhook={editingWebhook}
      />

      <Dialog
        open={Boolean(deletingWebhook)}
        onOpenChange={(open) => !open && setDeletingWebhook(undefined)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete webhook</DialogTitle>
            <DialogDescription>
              Delete this webhook? Delivery will stop immediately and this can't
              be undone.
            </DialogDescription>
          </DialogHeader>
          {deleteMutation.isError && (
            <p className="text-xs text-brick">
              {getApiErrorMessage(
                deleteMutation.error,
                'Unable to delete webhook.',
              )}
            </p>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeletingWebhook(undefined)}
            >
              Cancel
            </Button>
            <Button
              className="bg-brick text-paper hover:bg-brick/90"
              disabled={deleteMutation.isPending}
              onClick={() => {
                if (!deletingWebhook) return
                deleteMutation.mutate(deletingWebhook.id, {
                  onSuccess: () => {
                    setDeletingWebhook(undefined)
                    if (selectedWebhookId === deletingWebhook.id) {
                      setSelectedWebhookId(null)
                    }
                  },
                })
              }}
            >
              {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
