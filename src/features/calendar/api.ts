import { apiClient } from '@/lib/api-client'
import type { CalendarEvent } from '@/types/calendar'

export function getCalendarEvents(from: string, to: string) {
  return apiClient
    .get<{ data: CalendarEvent[] }>('/calendar', { params: { from, to } })
    .then((res) => res.data.data)
}
