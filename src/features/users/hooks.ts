import { useQuery } from '@tanstack/react-query'
import { getOrgMembers } from '@/features/users/api'

export function useOrgMembers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: getOrgMembers,
  })
}
