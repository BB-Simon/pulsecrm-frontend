const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value)
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

const relativeTimeFormatter = new Intl.RelativeTimeFormat('en-US', {
  numeric: 'auto',
})

export function formatRelativeTime(iso: string): string {
  const diffSeconds = Math.round((new Date(iso).getTime() - Date.now()) / 1000)
  const absSeconds = Math.abs(diffSeconds)

  if (absSeconds < 60)
    return relativeTimeFormatter.format(diffSeconds, 'second')
  const diffMinutes = Math.round(diffSeconds / 60)
  if (Math.abs(diffMinutes) < 60)
    return relativeTimeFormatter.format(diffMinutes, 'minute')
  const diffHours = Math.round(diffMinutes / 60)
  if (Math.abs(diffHours) < 24)
    return relativeTimeFormatter.format(diffHours, 'hour')
  const diffDays = Math.round(diffHours / 24)
  if (Math.abs(diffDays) < 30)
    return relativeTimeFormatter.format(diffDays, 'day')
  const diffMonths = Math.round(diffDays / 30)
  return relativeTimeFormatter.format(diffMonths, 'month')
}
