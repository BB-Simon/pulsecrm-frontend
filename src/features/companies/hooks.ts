import { useQuery } from '@tanstack/react-query'
import { getCompanies } from '@/features/companies/api'

export function useCompanies() {
  return useQuery({
    queryKey: ['companies'],
    queryFn: getCompanies,
  })
}
