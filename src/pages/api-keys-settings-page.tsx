import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
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
import { useApiKeys, useRevokeApiKey } from '@/features/api-keys/hooks'
import { ApiKeyFormDialog } from '@/components/settings/api-key-form-dialog'
import { useAuthStore } from '@/stores/auth-store'
import { getApiErrorMessage } from '@/lib/errors'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { ApiKey } from '@/types/api-key'

export function ApiKeysSettingsPage() {
  const role = useAuthStore((state) => state.user?.role)
  const apiKeysQuery = useApiKeys()
  const revokeMutation = useRevokeApiKey()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [revokingKey, setRevokingKey] = useState<ApiKey | undefined>()

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
        <p className="text-sm text-ink/50">Only admins can manage API keys.</p>
      </div>
    )
  }

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
        <h1 className="font-heading text-2xl text-ink">API Keys</h1>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="size-4" />
          New key
        </Button>
      </div>

      {apiKeysQuery.isError && (
        <p className="text-sm text-brick">
          {getApiErrorMessage(apiKeysQuery.error, 'Unable to load API keys.')}
        </p>
      )}

      {apiKeysQuery.isPending && (
        <div className="flex flex-col gap-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      )}

      {apiKeysQuery.data && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Key</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Last used</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {apiKeysQuery.data.data.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-10 text-center text-sm text-ink/50"
                >
                  No API keys yet.
                </TableCell>
              </TableRow>
            )}
            {apiKeysQuery.data.data.map((apiKey) => {
              const isRevoked = Boolean(apiKey.revokedAt)
              return (
                <TableRow key={apiKey.id}>
                  <TableCell className="text-sm text-ink">
                    {apiKey.name}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-ink/70">
                    {apiKey.keyPreview}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-ink/50">
                    {formatDate(apiKey.createdAt)}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-ink/50">
                    {apiKey.lastUsedAt
                      ? formatDate(apiKey.lastUsedAt)
                      : 'Never'}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn(
                        'border-0',
                        isRevoked
                          ? 'bg-mist text-ink/50'
                          : 'bg-ledger/10 text-ledger',
                      )}
                    >
                      {isRevoked ? 'Revoked' : 'Active'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {!isRevoked && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-brick hover:bg-brick/10 hover:text-brick"
                        onClick={() => setRevokingKey(apiKey)}
                      >
                        Revoke
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      )}

      <ApiKeyFormDialog open={isFormOpen} onOpenChange={setIsFormOpen} />

      <Dialog
        open={Boolean(revokingKey)}
        onOpenChange={(open) => !open && setRevokingKey(undefined)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke API key</DialogTitle>
            <DialogDescription>
              Revoke "{revokingKey?.name}"? Any integration using this key will
              immediately lose access. This can't be undone.
            </DialogDescription>
          </DialogHeader>
          {revokeMutation.isError && (
            <p className="text-xs text-brick">
              {getApiErrorMessage(
                revokeMutation.error,
                'Unable to revoke API key.',
              )}
            </p>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setRevokingKey(undefined)}>
              Cancel
            </Button>
            <Button
              className="bg-brick text-paper hover:bg-brick/90"
              disabled={revokeMutation.isPending}
              onClick={() => {
                if (!revokingKey) return
                revokeMutation.mutate(revokingKey.id, {
                  onSuccess: () => setRevokingKey(undefined),
                })
              }}
            >
              {revokeMutation.isPending ? 'Revoking…' : 'Revoke'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
