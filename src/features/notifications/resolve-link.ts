/**
 * The backend generates notification links like `/contacts/:id`, `/deals/:id`,
 * and `/tasks/:id` — but this app only has a detail route for contacts; deals
 * and tasks only have their list/board views. Map to the nearest real route
 * instead of navigating to a URL nothing matches.
 */
export function resolveNotificationLink(link: string | null): string {
  if (!link) return '/dashboard'
  if (link.startsWith('/contacts/')) return link
  if (link.startsWith('/deals/')) return '/deals'
  if (link.startsWith('/tasks/')) return '/tasks'
  return '/dashboard'
}
