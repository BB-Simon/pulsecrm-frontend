export type UserRole = 'ADMIN' | 'MANAGER' | 'REP'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  organizationId: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
}
