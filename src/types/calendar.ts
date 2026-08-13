export type CalendarEventType = 'deal' | 'task'

export interface CalendarEvent {
  type: CalendarEventType
  id: string
  date: string
  title: string
  contactId: string | null
  dealId: string | null
  ownerId: string
  value: number | null
  status: 'OPEN' | 'WON' | 'LOST' | null
  completed: boolean | null
}
