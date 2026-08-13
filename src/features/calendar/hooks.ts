import { useQuery } from '@tanstack/react-query'
import { getCalendarEvents } from '@/features/calendar/api'

export function useCalendarEvents(from: string, to: string) {
  return useQuery({
    queryKey: ['calendar', from, to],
    queryFn: () => getCalendarEvents(from, to),
    placeholderData: (previousData) => previousData,
  })
}
