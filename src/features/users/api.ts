import { apiClient } from '@/lib/api-client'
import type { OrgMember } from '@/types/user'

export function getOrgMembers() {
  return apiClient.get<OrgMember[]>('/users').then((res) => res.data)
}
