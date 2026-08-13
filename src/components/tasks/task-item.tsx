import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'
import { useCompleteTask } from '@/features/tasks/hooks'
import type { Task } from '@/types/task'

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})

export function TaskItem({
  task,
  contactName,
  overdue,
}: {
  task: Task
  contactName?: string
  overdue?: boolean
}) {
  const completeMutation = useCompleteTask()

  return (
    <div className="flex items-start gap-3 border-b border-mist py-3 last:border-0">
      <Checkbox
        className="mt-0.5"
        checked={completeMutation.isPending ? true : task.completed}
        disabled={completeMutation.isPending}
        onCheckedChange={(checked) => {
          if (checked) completeMutation.mutate(task.id)
        }}
        aria-label={`Mark "${task.title}" complete`}
      />
      <div className="min-w-0 flex-1">
        <p className="text-sm text-ink">{task.title}</p>
        {task.description && (
          <p className="mt-0.5 text-xs text-ink/50">{task.description}</p>
        )}
        <div className="mt-1 flex items-center gap-2">
          <span
            className={cn(
              'font-mono text-xs',
              overdue ? 'text-brick' : 'text-ink/40',
            )}
          >
            {timeFormatter.format(new Date(task.dueDate))}
          </span>
          {contactName && (
            <span className="text-xs text-ink/40">· {contactName}</span>
          )}
        </div>
      </div>
    </div>
  )
}
