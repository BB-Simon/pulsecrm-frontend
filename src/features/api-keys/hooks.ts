import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createApiKey, getApiKeys, revokeApiKey } from '@/features/api-keys/api'
import type { ApiKeyInput } from '@/types/api-key'

const API_KEYS_KEY = ['api-keys']

export function useApiKeys() {
  return useQuery({
    queryKey: API_KEYS_KEY,
    queryFn: getApiKeys,
  })
}

export function useCreateApiKey() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: ApiKeyInput) => createApiKey(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: API_KEYS_KEY })
    },
  })
}

export function useRevokeApiKey() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => revokeApiKey(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: API_KEYS_KEY })
    },
  })
}
