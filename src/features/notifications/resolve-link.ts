/**
 * The backend generates notification links like `/contacts/:id`, `/deals/:id`,
 * and `/tasks/:id`. Tasks still has no detail route (list/board view only) —
 * fall back to the list instead of navigating to a URL nothing matches.
 */
export function resolveNotificationLink(link: string | null): string {
  if (!link) return '/dashboard'
  if (link.startsWith('/contacts/')) return link
  if (link.startsWith('/deals/')) return link
  if (link.startsWith('/tasks/')) return '/tasks'
  return '/dashboard'
}
