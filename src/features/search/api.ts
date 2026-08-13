import { apiClient } from '@/lib/api-client'
import type { SearchResults } from '@/types/search'

export function globalSearch(q: string) {
  return apiClient
    .get<SearchResults>('/search', { params: { q, limit: 5 } })
    .then((res) => res.data)
}
