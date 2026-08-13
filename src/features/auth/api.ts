import { apiClient } from '@/lib/api-client'
import type { AuthResponse } from '@/types/auth'
import type {
  AcceptInviteInput,
  LoginInput,
  SignupInput,
} from '@/features/auth/schemas'

export function login(input: LoginInput) {
  return apiClient
    .post<AuthResponse>('/auth/login', input)
    .then((res) => res.data)
}

export function signup(input: SignupInput) {
  return apiClient
    .post<AuthResponse>('/auth/signup', input)
    .then((res) => res.data)
}

export function acceptInvite(input: AcceptInviteInput & { token: string }) {
  return apiClient
    .post<AuthResponse>('/auth/accept-invite', input)
    .then((res) => res.data)
}
