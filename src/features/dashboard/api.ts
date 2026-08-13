import { apiClient } from '@/lib/api-client'
import type { DashboardData } from '@/types/dashboard'

export function getDashboard() {
  return apiClient.get<DashboardData>('/dashboard').then((res) => res.data)
}
