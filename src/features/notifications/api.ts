import { apiClient } from '@/lib/api-client'
import type { Notification } from '@/types/notification'
import type { PaginatedResponse } from '@/types/pagination'

export interface NotificationsPage extends PaginatedResponse<Notification> {
  unreadCount: number
}

export function getNotifications() {
  return apiClient
    .get<NotificationsPage>('/notifications', { params: { limit: 10 } })
    .then((res) => res.data)
}

export function markNotificationRead(id: string) {
  return apiClient
    .patch<Notification>(`/notifications/${id}/read`)
    .then((res) => res.data)
}

export function markAllNotificationsRead() {
  return apiClient
    .patch<{ updated: number }>('/notifications/read-all')
    .then((res) => res.data)
}
