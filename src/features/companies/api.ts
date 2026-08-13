import { apiClient } from '@/lib/api-client'
import type { Company } from '@/types/company'
import type { PaginatedResponse } from '@/types/pagination'

export function getCompanies() {
  return apiClient
    .get<PaginatedResponse<Company>>('/companies', { params: { limit: 100 } })
    .then((res) => res.data.data)
}
