import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { formatRelativeTime } from '@/lib/format'
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
} from '@/features/notifications/hooks'
import { resolveNotificationLink } from '@/features/notifications/resolve-link'
import type { Notification } from '@/types/notification'

export function NotificationBell() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const notificationsQuery = useNotifications()
  const markReadMutation = useMarkNotificationRead()
  const markAllReadMutation = useMarkAllNotificationsRead()

  const unreadCount = notificationsQuery.data?.unreadCount ?? 0
  const notifications = notificationsQuery.data?.data ?? []

  function selectNotification(notification: Notification) {
    if (!notification.readAt) {
      markReadMutation.mutate(notification.id)
    }
    setIsOpen(false)
    navigate(resolveNotificationLink(notification.link))
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger
        className="relative flex size-8 items-center justify-center rounded-full text-ink/60 outline-none hover:bg-muted hover:text-ink"
        aria-label={
          unreadCount > 0
            ? `Notifications, ${unreadCount} unread`
            : 'Notifications'
        }
      >
        <Bell className="size-4" strokeWidth={1.75} />
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-ochre px-0.5 font-mono text-[9px] leading-none text-ink">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-96 min-w-96 p-0">
        <div className="flex items-center justify-between border-b border-mist px-3 py-2">
          <span className="text-sm font-medium text-ink">Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs text-ink/50 hover:text-ink"
              disabled={markAllReadMutation.isPending}
              onClick={() => markAllReadMutation.mutate()}
            >
              Mark all read
            </Button>
          )}
        </div>

        <div className="max-h-96 overflow-y-auto">
          {notificationsQuery.isPending && (
            <p className="px-3 py-6 text-center text-sm text-ink/50">
              Loading…
            </p>
          )}

          {notificationsQuery.isError && (
            <p className="px-3 py-6 text-center text-sm text-brick">
              Unable to load notifications.
            </p>
          )}

          {notificationsQuery.data && notifications.length === 0 && (
            <p className="px-3 py-6 text-center text-sm text-ink/40">
              You're all caught up.
            </p>
          )}

          {notifications.map((notification) => (
            <button
              key={notification.id}
              type="button"
              onClick={() => selectNotification(notification)}
              className="flex w-full items-start gap-2.5 border-b border-mist px-3 py-2.5 text-left last:border-0 hover:bg-muted"
            >
              <span
                aria-hidden="true"
                className={cn(
                  'mt-1.5 size-1.5 shrink-0 rounded-full',
                  notification.readAt ? 'bg-transparent' : 'bg-ochre',
                )}
              />
              <span className="min-w-0 flex-1">
                <span
                  className={cn(
                    'block text-sm',
                    notification.readAt
                      ? 'text-ink/70'
                      : 'font-medium text-ink',
                  )}
                >
                  {notification.title}
                </span>
                <span className="mt-0.5 block truncate text-xs text-ink/50">
                  {notification.body}
                </span>
              </span>
              <span className="shrink-0 font-mono text-[11px] text-ink/40">
                {formatRelativeTime(notification.createdAt)}
              </span>
            </button>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
