export type TaskBucket = 'overdue' | 'today' | 'upcoming'

export function getTaskBucket(dueDateIso: string): TaskBucket {
  const due = new Date(dueDateIso)
  const now = new Date()
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  )
  const startOfTomorrow = new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000)

  if (due < startOfToday) return 'overdue'
  if (due < startOfTomorrow) return 'today'
  return 'upcoming'
}
