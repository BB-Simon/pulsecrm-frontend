import { useQuery } from '@tanstack/react-query'
import { globalSearch } from '@/features/search/api'

export function useGlobalSearch(query: string) {
  const trimmed = query.trim()
  return useQuery({
    queryKey: ['search', trimmed],
    queryFn: () => globalSearch(trimmed),
    enabled: trimmed.length > 0,
  })
}
