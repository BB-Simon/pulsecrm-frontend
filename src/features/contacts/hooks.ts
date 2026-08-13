import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createContact,
  deleteContact,
  getContact,
  getContacts,
  scoreContact,
  updateContact,
} from '@/features/contacts/api'
import type { Contact, ContactInput, ContactListQuery } from '@/types/contact'

export function useContacts(query: ContactListQuery) {
  return useQuery({
    queryKey: ['contacts', query],
    queryFn: () => getContacts(query),
    placeholderData: (previousData) => previousData,
  })
}

export function useContact(id: string | undefined) {
  return useQuery({
    queryKey: ['contacts', id],
    queryFn: () => getContact(id!),
    enabled: Boolean(id),
  })
}

export function useCreateContact() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: ContactInput) => createContact(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
    },
  })
}

export function useUpdateContact(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: Partial<ContactInput>) => updateContact(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
    },
  })
}

export function useDeleteContact() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteContact(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] })
    },
  })
}

export function useScoreContact(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => scoreContact(id),
    onSuccess: (leadScore) => {
      queryClient.setQueryData<Contact>(['contacts', id], (previous) =>
        previous
          ? {
              ...previous,
              leadScore: leadScore.score,
              leadScoreRationale: leadScore.rationale,
              leadScoredAt: leadScore.scoredAt,
            }
          : previous,
      )
    },
  })
}
