import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Calendar as BigCalendar,
  dateFnsLocalizer,
  Views,
  type EventPropGetter,
  type View,
} from 'react-big-calendar'
import {
  format,
  parse,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  getDay,
} from 'date-fns'
import { enUS } from 'date-fns/locale'
import { HandCoins, ListChecks } from 'lucide-react'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import '@/styles/calendar.css'
import { useCalendarEvents } from '@/features/calendar/hooks'
import { getApiErrorMessage } from '@/lib/errors'
import { formatCurrency } from '@/lib/format'
import type { CalendarEvent } from '@/types/calendar'

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { 'en-US': enUS },
})

interface RbcEvent {
  id: string
  title: string
  start: Date
  end: Date
  allDay: boolean
  resource: CalendarEvent
}

function isOverdueTask(resource: CalendarEvent): boolean {
  return (
    resource.type === 'task' &&
    !resource.completed &&
    new Date(resource.date) < new Date(new Date().toDateString())
  )
}

const eventPropGetter: EventPropGetter<RbcEvent> = (event) => {
  const { resource } = event
  let background = 'color-mix(in oklch, var(--ink), var(--paper) 85%)'
  let color = 'var(--ink)'

  if (resource.type === 'deal') {
    if (resource.status === 'WON') {
      background = 'var(--ledger)'
      color = 'var(--paper)'
    } else if (resource.status === 'LOST') {
      background = 'var(--brick)'
      color = 'var(--paper)'
    } else {
      background = 'color-mix(in oklch, var(--ledger), var(--paper) 78%)'
      color = 'var(--ledger)'
    }
  } else if (resource.type === 'task') {
    if (resource.completed) {
      background = 'var(--mist)'
      color = 'color-mix(in oklch, var(--ink), transparent 45%)'
    } else if (isOverdueTask(resource)) {
      background = 'color-mix(in oklch, var(--brick), var(--paper) 75%)'
      color = 'var(--brick)'
    }
  }

  return { style: { backgroundColor: background, color } }
}

function EventContent({ event }: { event: RbcEvent }) {
  const Icon = event.resource.type === 'deal' ? HandCoins : ListChecks
  return (
    <span className="flex items-center gap-1">
      <Icon className="size-3 shrink-0" strokeWidth={2} />
      <span className="truncate">{event.title}</span>
      {event.resource.type === 'deal' && event.resource.value !== null && (
        <span className="font-mono text-[10px] opacity-70">
          {formatCurrency(event.resource.value)}
        </span>
      )}
    </span>
  )
}

export function CalendarPage() {
  const navigate = useNavigate()
  const [date, setDate] = useState(new Date())
  const [view, setView] = useState<View>(Views.MONTH)

  const { from, to } = useMemo(() => {
    if (view === Views.WEEK) {
      return {
        from: startOfWeek(date, { weekStartsOn: 0 }),
        to: endOfWeek(date, { weekStartsOn: 0 }),
      }
    }
    return {
      from: startOfWeek(startOfMonth(date), { weekStartsOn: 0 }),
      to: endOfWeek(endOfMonth(date), { weekStartsOn: 0 }),
    }
  }, [date, view])

  const eventsQuery = useCalendarEvents(
    format(from, 'yyyy-MM-dd'),
    format(to, 'yyyy-MM-dd'),
  )

  const events = useMemo<RbcEvent[]>(
    () =>
      (eventsQuery.data ?? []).map((resource) => {
        const eventDate = new Date(resource.date)
        return {
          id: `${resource.type}-${resource.id}`,
          title: resource.title,
          start: eventDate,
          end: eventDate,
          allDay: true,
          resource,
        }
      }),
    [eventsQuery.data],
  )

  function handleSelectEvent(event: RbcEvent) {
    const { resource } = event
    if (resource.type === 'deal') {
      navigate(`/deals/${resource.id}`)
    } else {
      navigate('/tasks')
    }
  }

  return (
    <div className="flex h-full flex-col gap-6">
      <h1 className="font-heading text-2xl text-ink">Calendar</h1>

      {eventsQuery.isError && (
        <p className="text-sm text-brick">
          {getApiErrorMessage(
            eventsQuery.error,
            'Unable to load the calendar.',
          )}
        </p>
      )}

      <div
        className="min-h-0 flex-1"
        style={{ opacity: eventsQuery.isPlaceholderData ? 0.6 : 1 }}
      >
        <BigCalendar
          localizer={localizer}
          events={events}
          date={date}
          onNavigate={setDate}
          view={view}
          onView={setView}
          views={[Views.MONTH, Views.WEEK]}
          style={{ height: '100%', minHeight: 640 }}
          eventPropGetter={eventPropGetter}
          onSelectEvent={handleSelectEvent}
          popup
          components={{ event: EventContent }}
        />
      </div>
    </div>
  )
}
