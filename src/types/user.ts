import type { UserRole } from '@/types/auth'

export interface OrgMember {
  id: string
  firstName: string
  lastName: string
  email: string
  role: UserRole
}
