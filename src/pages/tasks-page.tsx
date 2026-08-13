import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useMyTasks } from '@/features/tasks/hooks'
import { useContacts } from '@/features/contacts/hooks'
import { getTaskBucket, type TaskBucket } from '@/features/tasks/bucket'
import { TaskItem } from '@/components/tasks/task-item'
import { TaskFormDialog } from '@/components/tasks/task-form-dialog'
import { getApiErrorMessage } from '@/lib/errors'
import type { Task } from '@/types/task'

const SECTIONS: { bucket: TaskBucket; label: string }[] = [
  { bucket: 'overdue', label: 'Overdue' },
  { bucket: 'today', label: 'Today' },
  { bucket: 'upcoming', label: 'Upcoming' },
]

export function TasksPage() {
  const tasksQuery = useMyTasks()
  const contactsQuery = useContacts({ limit: 100 })
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const contactNameById = useMemo(() => {
    const map = new Map<string, string>()
    contactsQuery.data?.data.forEach((contact) =>
      map.set(contact.id, `${contact.firstName} ${contact.lastName}`),
    )
    return map
  }, [contactsQuery.data])

  const tasksByBucket = useMemo(() => {
    const map: Record<TaskBucket, Task[]> = {
      overdue: [],
      today: [],
      upcoming: [],
    }
    tasksQuery.data?.data.forEach((task) => {
      map[getTaskBucket(task.dueDate)].push(task)
    })
    return map
  }, [tasksQuery.data])

  const isEmpty = tasksQuery.data?.data.length === 0

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-heading text-2xl text-ink">Tasks</h1>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="size-4" />
          New task
        </Button>
      </div>

      {tasksQuery.isError && (
        <p className="text-sm text-brick">
          {getApiErrorMessage(tasksQuery.error, 'Unable to load tasks.')}
        </p>
      )}

      {tasksQuery.isPending && (
        <div className="flex flex-col gap-3">
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
          <Skeleton className="h-14 w-full" />
        </div>
      )}

      {isEmpty && (
        <p className="py-10 text-center text-sm text-ink/40">
          Nothing on your plate. Create a task to get started.
        </p>
      )}

      {tasksQuery.data &&
        !isEmpty &&
        SECTIONS.map(({ bucket, label }) => {
          const tasks = tasksByBucket[bucket]
          if (tasks.length === 0) return null
          return (
            <section key={bucket}>
              <h2
                className={
                  bucket === 'overdue'
                    ? 'font-mono text-xs tracking-wider text-brick uppercase'
                    : 'font-mono text-xs tracking-wider text-ink/50 uppercase'
                }
              >
                {label} <span className="text-ink/30">({tasks.length})</span>
              </h2>
              <div className="mt-2 rounded-md border border-mist bg-card px-3">
                {tasks.map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    contactName={
                      task.contactId
                        ? contactNameById.get(task.contactId)
                        : undefined
                    }
                    overdue={bucket === 'overdue'}
                  />
                ))}
              </div>
            </section>
          )
        })}

      <TaskFormDialog open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </div>
  )
}
