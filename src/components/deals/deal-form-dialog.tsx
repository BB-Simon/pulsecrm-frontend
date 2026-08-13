import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useContacts } from '@/features/contacts/hooks'
import { useOrgMembers } from '@/features/users/hooks'
import { useCreateDeal } from '@/features/deals/hooks'
import { dealFormSchema, type DealFormInput } from '@/features/deals/schemas'
import { useAuthStore } from '@/stores/auth-store'
import { getApiErrorMessage } from '@/lib/errors'
import type { PipelineStage } from '@/types/deal'

export function DealFormDialog({
  open,
  onOpenChange,
  stages,
  defaultStageId,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  stages: PipelineStage[]
  defaultStageId?: string
}) {
  const role = useAuthStore((state) => state.user?.role)
  const canAssignOwner = role === 'ADMIN' || role === 'MANAGER'

  const contactsQuery = useContacts({ limit: 100 })
  const membersQuery = useOrgMembers()
  const createMutation = useCreateDeal()

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<DealFormInput>({
    resolver: zodResolver(dealFormSchema),
    defaultValues: {
      title: '',
      value: 0,
      contactId: '',
      pipelineStageId: defaultStageId ?? stages[0]?.id ?? '',
      expectedCloseDate: '',
    },
  })

  useEffect(() => {
    if (open) {
      reset({
        title: '',
        value: 0,
        contactId: '',
        pipelineStageId: defaultStageId ?? stages[0]?.id ?? '',
        expectedCloseDate: '',
      })
      createMutation.reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, defaultStageId])

  const onSubmit = (input: DealFormInput) => {
    createMutation.mutate(
      {
        title: input.title,
        value: input.value,
        contactId: input.contactId,
        pipelineStageId: input.pipelineStageId,
        expectedCloseDate: input.expectedCloseDate || undefined,
        ...(canAssignOwner ? { ownerId: input.ownerId } : {}),
      },
      { onSuccess: () => onOpenChange(false) },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New deal</DialogTitle>
          <DialogDescription>Add a new deal to the pipeline.</DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          noValidate
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Acme Corp — annual contract"
              {...register('title')}
            />
            {errors.title && (
              <p className="text-xs text-brick">{errors.title.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="value">Value (USD)</Label>
              <Input
                id="value"
                type="number"
                min={0}
                step="0.01"
                {...register('value', { valueAsNumber: true })}
              />
              {errors.value && (
                <p className="text-xs text-brick">{errors.value.message}</p>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="expectedCloseDate">Expected close</Label>
              <Input
                id="expectedCloseDate"
                type="date"
                {...register('expectedCloseDate')}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="contactId">Contact</Label>
            <Controller
              control={control}
              name="contactId"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="contactId" className="w-full">
                    <SelectValue placeholder="Select a contact" />
                  </SelectTrigger>
                  <SelectContent>
                    {contactsQuery.data?.data.map((contact) => (
                      <SelectItem key={contact.id} value={contact.id}>
                        {contact.firstName} {contact.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.contactId && (
              <p className="text-xs text-brick">{errors.contactId.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="pipelineStageId">Stage</Label>
            <Controller
              control={control}
              name="pipelineStageId"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="pipelineStageId" className="w-full">
                    <SelectValue placeholder="Select a stage" />
                  </SelectTrigger>
                  <SelectContent>
                    {stages.map((stage) => (
                      <SelectItem key={stage.id} value={stage.id}>
                        {stage.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {canAssignOwner && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="ownerId">Owner</Label>
              <Controller
                control={control}
                name="ownerId"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="ownerId" className="w-full">
                      <SelectValue placeholder="Assign to…" />
                    </SelectTrigger>
                    <SelectContent>
                      {membersQuery.data?.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          {member.firstName} {member.lastName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          )}

          {createMutation.isError && (
            <p className="text-xs text-brick">
              {getApiErrorMessage(
                createMutation.error,
                'Unable to create deal.',
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
              {createMutation.isPending ? 'Creating…' : 'Create deal'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
