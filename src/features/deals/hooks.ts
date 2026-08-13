import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createDeal,
  getDeals,
  getPipelineStages,
  moveDealStage,
} from '@/features/deals/api'
import type { Deal, DealInput } from '@/types/deal'
import type { PaginatedResponse } from '@/types/pagination'

const DEALS_BOARD_KEY = ['deals', 'board']

export function usePipelineStages() {
  return useQuery({
    queryKey: ['pipeline-stages'],
    queryFn: getPipelineStages,
  })
}

export function useDeals() {
  return useQuery({
    queryKey: DEALS_BOARD_KEY,
    queryFn: getDeals,
  })
}

export function useCreateDeal() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: DealInput) => createDeal(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DEALS_BOARD_KEY })
    },
  })
}

export function useMoveDealStage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      dealId,
      pipelineStageId,
    }: {
      dealId: string
      pipelineStageId: string
    }) => moveDealStage(dealId, pipelineStageId),
    onMutate: async ({ dealId, pipelineStageId }) => {
      await queryClient.cancelQueries({ queryKey: DEALS_BOARD_KEY })
      const previous =
        queryClient.getQueryData<PaginatedResponse<Deal>>(DEALS_BOARD_KEY)

      if (previous) {
        queryClient.setQueryData<PaginatedResponse<Deal>>(DEALS_BOARD_KEY, {
          ...previous,
          data: previous.data.map((deal) =>
            deal.id === dealId ? { ...deal, pipelineStageId } : deal,
          ),
        })
      }

      return { previous }
    },
    onError: (_error, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(DEALS_BOARD_KEY, context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: DEALS_BOARD_KEY })
    },
  })
}
