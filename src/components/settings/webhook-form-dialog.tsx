import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
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
import { Checkbox } from '@/components/ui/checkbox'
import { useCreateWebhook, useUpdateWebhook } from '@/features/webhooks/hooks'
import {
  webhookFormSchema,
  type WebhookFormInput,
} from '@/features/webhooks/schemas'
import { getApiErrorMessage } from '@/lib/errors'
import { WEBHOOK_EVENT_TYPES, type Webhook } from '@/types/webhook'

const EVENT_LABELS: Record<(typeof WEBHOOK_EVENT_TYPES)[number], string> = {
  'deal.won': 'Deal won',
  'deal.lost': 'Deal lost',
  'deal.stage_changed': 'Deal stage changed',
  'task.overdue': 'Task overdue',
  'lead.assigned': 'Lead assigned',
}

export function WebhookFormDialog({
  open,
  onOpenChange,
  webhook,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  webhook?: Webhook
}) {
  const isEdit = Boolean(webhook)
  const createMutation = useCreateWebhook()
  const updateMutation = useUpdateWebhook(webhook?.id ?? '')
  const mutation = isEdit ? updateMutation : createMutation

  const [copied, setCopied] = useState(false)
  const revealedSecret =
    !isEdit && createMutation.isSuccess ? createMutation.data.secret : null

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<WebhookFormInput>({
    resolver: zodResolver(webhookFormSchema),
    defaultValues: {
      targetUrl: webhook?.targetUrl ?? '',
      subscribedEvents: (webhook?.subscribedEvents ??
        []) as WebhookFormInput['subscribedEvents'],
    },
  })

  useEffect(() => {
    if (open) {
      reset({
        targetUrl: webhook?.targetUrl ?? '',
        subscribedEvents: (webhook?.subscribedEvents ??
          []) as WebhookFormInput['subscribedEvents'],
      })
      mutation.reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, webhook])

  const onSubmit = (input: WebhookFormInput) => {
    if (isEdit) {
      updateMutation.mutate(input, { onSuccess: () => onOpenChange(false) })
    } else {
      setCopied(false)
      createMutation.mutate(input)
    }
  }

  const handleCopy = () => {
    if (!revealedSecret) return
    navigator.clipboard.writeText(revealedSecret)
    setCopied(true)
  }

  if (revealedSecret) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Signing secret</DialogTitle>
            <DialogDescription>
              This is shown only once. Store it now — you won't be able to
              retrieve it again.
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center gap-2 rounded-md border border-mist bg-muted px-3 py-2">
            <code className="flex-1 overflow-x-auto font-mono text-sm text-ink">
              {revealedSecret}
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
          <DialogTitle>{isEdit ? 'Edit webhook' : 'New webhook'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update the target URL or subscribed events.'
              : 'POST a signed payload to a URL when subscribed events fire.'}
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          noValidate
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="targetUrl">Target URL</Label>
            <Input
              id="targetUrl"
              type="url"
              placeholder="https://hooks.slack.com/services/…"
              {...register('targetUrl')}
            />
            {errors.targetUrl && (
              <p className="text-xs text-brick">{errors.targetUrl.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Events</Label>
            <Controller
              control={control}
              name="subscribedEvents"
              render={({ field }) => (
                <div className="flex flex-col gap-2 rounded-md border border-mist p-3">
                  {WEBHOOK_EVENT_TYPES.map((eventType) => {
                    const checked = field.value.includes(eventType)
                    return (
                      <label
                        key={eventType}
                        className="flex items-center gap-2 text-sm text-ink"
                      >
                        <Checkbox
                          checked={checked}
                          onCheckedChange={(value) => {
                            field.onChange(
                              value
                                ? [...field.value, eventType]
                                : field.value.filter((e) => e !== eventType),
                            )
                          }}
                        />
                        {EVENT_LABELS[eventType]}
                      </label>
                    )
                  })}
                </div>
              )}
            />
            {errors.subscribedEvents && (
              <p className="text-xs text-brick">
                {errors.subscribedEvents.message}
              </p>
            )}
          </div>

          {mutation.isError && (
            <p className="text-xs text-brick">
              {getApiErrorMessage(mutation.error, 'Unable to save webhook.')}
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
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending
                ? 'Saving…'
                : isEdit
                  ? 'Save changes'
                  : 'Create webhook'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
