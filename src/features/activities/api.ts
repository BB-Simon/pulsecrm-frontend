import { apiClient } from '@/lib/api-client'
import type { Activity, ActivityInput } from '@/types/activity'
import type { PaginatedResponse } from '@/types/pagination'

export function getContactActivities(contactId: string) {
  return apiClient
    .get<PaginatedResponse<Activity>>('/activities', {
      params: { contactId, limit: 100 },
    })
    .then((res) => res.data)
}

export function createActivity(input: ActivityInput) {
  return apiClient.post<Activity>('/activities', input).then((res) => res.data)
}
