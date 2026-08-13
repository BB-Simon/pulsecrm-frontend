import {
  LayoutDashboard,
  Users,
  HandCoins,
  ListChecks,
  Settings,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  label: string
  to: string
  icon: LucideIcon
}

export const navItems: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Contacts', to: '/contacts', icon: Users },
  { label: 'Deals', to: '/deals', icon: HandCoins },
  { label: 'Tasks', to: '/tasks', icon: ListChecks },
  { label: 'Settings', to: '/settings', icon: Settings },
]
