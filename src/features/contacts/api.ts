import { apiClient } from '@/lib/api-client'
import type {
  Contact,
  ContactInput,
  ContactListQuery,
  LeadScore,
} from '@/types/contact'
import type { PaginatedResponse } from '@/types/pagination'

export function getContacts(query: ContactListQuery) {
  return apiClient
    .get<PaginatedResponse<Contact>>('/contacts', { params: query })
    .then((res) => res.data)
}

export function getContact(id: string) {
  return apiClient.get<Contact>(`/contacts/${id}`).then((res) => res.data)
}

export function createContact(input: ContactInput) {
  return apiClient.post<Contact>('/contacts', input).then((res) => res.data)
}

export function updateContact(id: string, input: Partial<ContactInput>) {
  return apiClient
    .patch<Contact>(`/contacts/${id}`, input)
    .then((res) => res.data)
}

export function deleteContact(id: string) {
  return apiClient.delete(`/contacts/${id}`).then(() => undefined)
}

export function scoreContact(id: string) {
  return apiClient
    .post<LeadScore>(`/contacts/${id}/score`)
    .then((res) => res.data)
}
