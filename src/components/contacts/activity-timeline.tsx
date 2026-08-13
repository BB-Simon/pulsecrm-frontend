import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Phone, Mail, Users, StickyNote, type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  useContactActivities,
  useCreateActivity,
} from '@/features/activities/hooks'
import {
  activityFormSchema,
  type ActivityFormInput,
} from '@/features/activities/schemas'
import { getApiErrorMessage } from '@/lib/errors'
import { formatDateTime } from '@/lib/format'
import type { ActivityType } from '@/types/activity'

const ACTIVITY_ICON: Record<ActivityType, LucideIcon> = {
  CALL: Phone,
  EMAIL: Mail,
  MEETING: Users,
  NOTE: StickyNote,
}

const ACTIVITY_LABEL: Record<ActivityType, string> = {
  CALL: 'Call',
  EMAIL: 'Email',
  MEETING: 'Meeting',
  NOTE: 'Note',
}

export function ActivityTimeline({ contactId }: { contactId: string }) {
  const activitiesQuery = useContactActivities(contactId)
  const createMutation = useCreateActivity(contactId)

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ActivityFormInput>({
    resolver: zodResolver(activityFormSchema),
    defaultValues: { type: 'NOTE', content: '' },
  })

  const onSubmit = (input: ActivityFormInput) => {
    createMutation.mutate(input, {
      onSuccess: () => reset({ type: input.type, content: '' }),
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-2 rounded-md border border-mist bg-card p-3"
      >
        <div className="flex items-start gap-2">
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-32 shrink-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(ACTIVITY_LABEL) as ActivityType[]).map(
                    (type) => (
                      <SelectItem key={type} value={type}>
                        {ACTIVITY_LABEL[type]}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            )}
          />
          <Textarea
            placeholder="Log a call, email, meeting, or note…"
            className="min-h-9 flex-1 resize-none"
            rows={1}
            {...register('content')}
          />
        </div>
        {errors.content && (
          <p className="text-xs text-brick">{errors.content.message}</p>
        )}
        {createMutation.isError && (
          <p className="text-xs text-brick">
            {getApiErrorMessage(
              createMutation.error,
              'Unable to log activity.',
            )}
          </p>
        )}
        <Button
          type="submit"
          size="sm"
          className="w-fit"
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? 'Logging…' : 'Log activity'}
        </Button>
      </form>

      {activitiesQuery.isPending && (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      )}

      {activitiesQuery.isError && (
        <p className="text-sm text-brick">
          {getApiErrorMessage(
            activitiesQuery.error,
            'Unable to load activity history.',
          )}
        </p>
      )}

      {activitiesQuery.data?.data.length === 0 && (
        <p className="py-4 text-center text-sm text-ink/40">
          No activity logged yet.
        </p>
      )}

      {activitiesQuery.data && activitiesQuery.data.data.length > 0 && (
        <ol className="flex flex-col">
          {activitiesQuery.data.data.map((activity, index) => {
            const Icon = ACTIVITY_ICON[activity.type]
            const isLast = index === activitiesQuery.data.data.length - 1
            return (
              <li key={activity.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-mist bg-card text-ink/60">
                    <Icon className="size-3.5" strokeWidth={1.75} />
                  </span>
                  {!isLast && <span className="w-px flex-1 bg-mist" />}
                </div>
                <div className={isLast ? 'pb-0' : 'pb-4'}>
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-xs font-medium text-ink/70">
                      {ACTIVITY_LABEL[activity.type]}
                    </span>
                    <span className="font-mono text-xs text-ink/40">
                      {formatDateTime(activity.occurredAt)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm whitespace-pre-wrap text-ink">
                    {activity.content}
                  </p>
                </div>
              </li>
            )
          })}
        </ol>
      )}
    </div>
  )
}
