export type NotificationType =
  'DEAL_STAGE_CHANGED' | 'TASK_OVERDUE' | 'LEAD_ASSIGNED'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  body: string
  link: string | null
  readAt: string | null
  createdAt: string
}
