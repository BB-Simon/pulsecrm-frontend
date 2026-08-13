import { apiClient } from '@/lib/api-client'
import type {
  Deal,
  DealInput,
  DealSummary,
  FollowUpDraft,
  PipelineStage,
} from '@/types/deal'
import type { PaginatedResponse } from '@/types/pagination'

export function getPipelineStages() {
  return apiClient
    .get<PipelineStage[]>('/deals/pipeline-stages')
    .then((res) => res.data)
}

export function getDeals() {
  return apiClient
    .get<PaginatedResponse<Deal>>('/deals', { params: { limit: 100 } })
    .then((res) => res.data)
}

export function getDeal(id: string) {
  return apiClient.get<Deal>(`/deals/${id}`).then((res) => res.data)
}

export function createDeal(input: DealInput) {
  return apiClient.post<Deal>('/deals', input).then((res) => res.data)
}

export function moveDealStage(dealId: string, pipelineStageId: string) {
  return apiClient
    .patch<Deal>(`/deals/${dealId}/stage`, { pipelineStageId })
    .then((res) => res.data)
}

export function draftFollowUp(dealId: string) {
  return apiClient
    .post<FollowUpDraft>(`/deals/${dealId}/draft-followup`)
    .then((res) => res.data)
}

export function summarizeDeal(dealId: string) {
  return apiClient
    .post<DealSummary>(`/deals/${dealId}/summary`)
    .then((res) => res.data)
}
