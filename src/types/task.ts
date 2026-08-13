export interface Task {
  id: string
  organizationId: string
  assigneeId: string
  contactId: string | null
  dealId: string | null
  title: string
  description: string | null
  dueDate: string
  completed: boolean
  completedAt: string | null
  createdAt: string
  updatedAt: string
}

export interface TaskInput {
  title: string
  description?: string
  dueDate: string
  contactId?: string
  dealId?: string
  assigneeId?: string
}
