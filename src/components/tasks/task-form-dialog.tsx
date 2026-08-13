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
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useContacts } from '@/features/contacts/hooks'
import { useOrgMembers } from '@/features/users/hooks'
import { useCreateTask } from '@/features/tasks/hooks'
import { taskFormSchema, type TaskFormInput } from '@/features/tasks/schemas'
import { useAuthStore } from '@/stores/auth-store'
import { getApiErrorMessage } from '@/lib/errors'

const NO_CONTACT = '__none__'

function defaultDueDate(): string {
  const inOneHour = new Date(Date.now() + 60 * 60 * 1000)
  inOneHour.setMinutes(0, 0, 0)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${inOneHour.getFullYear()}-${pad(inOneHour.getMonth() + 1)}-${pad(inOneHour.getDate())}T${pad(inOneHour.getHours())}:${pad(inOneHour.getMinutes())}`
}

export function TaskFormDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const role = useAuthStore((state) => state.user?.role)
  const canAssign = role === 'ADMIN' || role === 'MANAGER'

  const contactsQuery = useContacts({ limit: 100 })
  const membersQuery = useOrgMembers()
  const createMutation = useCreateTask()

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<TaskFormInput>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: '',
      description: '',
      dueDate: defaultDueDate(),
      contactId: NO_CONTACT,
    },
  })

  useEffect(() => {
    if (open) {
      reset({
        title: '',
        description: '',
        dueDate: defaultDueDate(),
        contactId: NO_CONTACT,
      })
      createMutation.reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const onSubmit = (input: TaskFormInput) => {
    createMutation.mutate(
      {
        title: input.title,
        description: input.description || undefined,
        dueDate: new Date(input.dueDate).toISOString(),
        contactId: input.contactId === NO_CONTACT ? undefined : input.contactId,
        ...(canAssign ? { assigneeId: input.assigneeId } : {}),
      },
      { onSuccess: () => onOpenChange(false) },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New task</DialogTitle>
          <DialogDescription>Add a task with a due date.</DialogDescription>
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
              placeholder="Send follow-up proposal"
              {...register('title')}
            />
            {errors.title && (
              <p className="text-xs text-brick">{errors.title.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={2}
              placeholder="Optional details…"
              {...register('description')}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="dueDate">Due date</Label>
            <Input
              id="dueDate"
              type="datetime-local"
              {...register('dueDate')}
            />
            {errors.dueDate && (
              <p className="text-xs text-brick">{errors.dueDate.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="contactId">Contact</Label>
            <Controller
              control={control}
              name="contactId"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="contactId" className="w-full">
                    <SelectValue placeholder="No contact" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={NO_CONTACT}>No contact</SelectItem>
                    {contactsQuery.data?.data.map((contact) => (
                      <SelectItem key={contact.id} value={contact.id}>
                        {contact.firstName} {contact.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {canAssign && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="assigneeId">Assignee</Label>
              <Controller
                control={control}
                name="assigneeId"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="assigneeId" className="w-full">
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
                'Unable to create task.',
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
              {createMutation.isPending ? 'Creating…' : 'Create task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
