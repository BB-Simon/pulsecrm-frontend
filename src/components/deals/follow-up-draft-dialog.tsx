import { useEffect, useState } from 'react'
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
import { Textarea } from '@/components/ui/textarea'
import { Skeleton } from '@/components/ui/skeleton'
import { useDraftFollowUp } from '@/features/deals/hooks'
import { useCreateActivity } from '@/features/activities/hooks'
import { getApiErrorMessage } from '@/lib/errors'

export function FollowUpDraftDialog({
  open,
  onOpenChange,
  dealId,
  contactId,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  dealId: string
  contactId: string
}) {
  const draftMutation = useDraftFollowUp(dealId)
  const logActivityMutation = useCreateActivity(contactId)

  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')

  useEffect(() => {
    if (open) {
      draftMutation.mutate(undefined, {
        onSuccess: (draft) => {
          setSubject(draft.subject)
          setBody(draft.body)
        },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const handleLog = () => {
    logActivityMutation.mutate(
      {
        type: 'EMAIL',
        content: `Subject: ${subject}\n\n${body}`,
        dealId,
      },
      { onSuccess: () => onOpenChange(false) },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Draft follow-up</DialogTitle>
          <DialogDescription>
            AI-drafted from this deal's contact and activity history. Edit
            before logging it.
          </DialogDescription>
        </DialogHeader>

        {draftMutation.isPending && (
          <div className="flex flex-col gap-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        )}

        {draftMutation.isError && (
          <p className="text-sm text-brick">
            {getApiErrorMessage(
              draftMutation.error,
              'Unable to draft a follow-up right now.',
            )}
          </p>
        )}

        {draftMutation.isSuccess && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="followup-subject">Subject</Label>
              <Input
                id="followup-subject"
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="followup-body">Body</Label>
              <Textarea
                id="followup-body"
                rows={10}
                value={body}
                onChange={(event) => setBody(event.target.value)}
              />
            </div>

            {logActivityMutation.isError && (
              <p className="text-xs text-brick">
                {getApiErrorMessage(
                  logActivityMutation.error,
                  'Unable to log this activity.',
                )}
              </p>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={!draftMutation.isSuccess || logActivityMutation.isPending}
            onClick={handleLog}
          >
            {logActivityMutation.isPending ? 'Logging…' : 'Log as activity'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
