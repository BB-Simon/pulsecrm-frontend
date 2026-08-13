import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createActivity, getContactActivities } from '@/features/activities/api'
import type { ActivityInput } from '@/types/activity'

export function useContactActivities(contactId: string | undefined) {
  return useQuery({
    queryKey: ['activities', contactId],
    queryFn: () => getContactActivities(contactId!),
    enabled: Boolean(contactId),
  })
}

export function useCreateActivity(contactId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: Omit<ActivityInput, 'contactId'>) =>
      createActivity({ ...input, contactId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['activities', contactId] })
    },
  })
}
