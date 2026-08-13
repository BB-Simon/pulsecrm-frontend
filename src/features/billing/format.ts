export function formatPricePerSeat(cents: number, currency: string): string {
  const amount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100)
  return `${amount}/seat/mo`
}

export function daysUntil(iso: string): number {
  const diffMs = new Date(iso).getTime() - Date.now()
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)))
}
