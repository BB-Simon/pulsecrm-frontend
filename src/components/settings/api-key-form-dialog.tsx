import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Check, Copy } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCreateApiKey } from '@/features/api-keys/hooks'
import {
  apiKeyFormSchema,
  type ApiKeyFormInput,
} from '@/features/api-keys/schemas'
import { getApiErrorMessage } from '@/lib/errors'

export function ApiKeyFormDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const createMutation = useCreateApiKey()
  const [copied, setCopied] = useState(false)
  const createdKey = createMutation.isSuccess ? createMutation.data.key : null

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ApiKeyFormInput>({
    resolver: zodResolver(apiKeyFormSchema),
    defaultValues: { name: '' },
  })

  useEffect(() => {
    if (open) {
      reset({ name: '' })
      createMutation.reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const onSubmit = (input: ApiKeyFormInput) => {
    setCopied(false)
    createMutation.mutate(input)
  }

  const handleCopy = () => {
    if (!createdKey) return
    navigator.clipboard.writeText(createdKey)
    setCopied(true)
  }

  if (createdKey) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>API key created</DialogTitle>
            <DialogDescription>
              This is shown only once. Store it now — you won't be able to
              retrieve it again.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-2 rounded-md border border-mist bg-muted px-3 py-2">
            <code className="flex-1 overflow-x-auto font-mono text-sm text-ink">
              {createdKey}
            </code>
            <Button variant="outline" size="icon-sm" onClick={handleCopy}>
              {copied ? (
                <Check className="size-3.5 text-ledger" />
              ) : (
                <Copy className="size-3.5" />
              )}
            </Button>
          </div>

          <DialogFooter>
            <Button onClick={() => onOpenChange(false)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New API key</DialogTitle>
          <DialogDescription>
            Generate a key for external integrations to authenticate against the
            public API.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          noValidate
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Zapier integration"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-xs text-brick">{errors.name.message}</p>
            )}
          </div>

          {createMutation.isError && (
            <p className="text-xs text-brick">
              {getApiErrorMessage(
                createMutation.error,
                'Unable to create API key.',
              )}
            </p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating…' : 'Create key'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
