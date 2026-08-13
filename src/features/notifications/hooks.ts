import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationRead,
  type NotificationsPage,
} from '@/features/notifications/api'

const NOTIFICATIONS_KEY = ['notifications']
const POLL_INTERVAL_MS = 30_000

export function useNotifications() {
  return useQuery({
    queryKey: NOTIFICATIONS_KEY,
    queryFn: getNotifications,
    refetchInterval: POLL_INTERVAL_MS,
    refetchIntervalInBackground: false,
  })
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => markNotificationRead(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_KEY })
      const previous =
        queryClient.getQueryData<NotificationsPage>(NOTIFICATIONS_KEY)

      if (previous) {
        const target = previous.data.find((n) => n.id === id)
        const wasUnread = target && !target.readAt
        queryClient.setQueryData<NotificationsPage>(NOTIFICATIONS_KEY, {
          ...previous,
          data: previous.data.map((n) =>
            n.id === id ? { ...n, readAt: new Date().toISOString() } : n,
          ),
          unreadCount: wasUnread
            ? Math.max(0, previous.unreadCount - 1)
            : previous.unreadCount,
        })
      }

      return { previous }
    },
    onError: (_error, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(NOTIFICATIONS_KEY, context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY })
    },
  })
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => markAllNotificationsRead(),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_KEY })
      const previous =
        queryClient.getQueryData<NotificationsPage>(NOTIFICATIONS_KEY)

      if (previous) {
        const now = new Date().toISOString()
        queryClient.setQueryData<NotificationsPage>(NOTIFICATIONS_KEY, {
          ...previous,
          data: previous.data.map((n) => ({ ...n, readAt: n.readAt ?? now })),
          unreadCount: 0,
        })
      }

      return { previous }
    },
    onError: (_error, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(NOTIFICATIONS_KEY, context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY })
    },
  })
}
