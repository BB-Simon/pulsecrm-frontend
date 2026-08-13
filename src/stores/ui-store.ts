import { create } from 'zustand'

interface UpgradeModalState {
  isOpen: boolean
  message: string | null
  openUpgradeModal: (message: string) => void
  closeUpgradeModal: () => void
}

export const useUIStore = create<UpgradeModalState>((set) => ({
  isOpen: false,
  message: null,
  openUpgradeModal: (message) => set({ isOpen: true, message }),
  closeUpgradeModal: () => set({ isOpen: false, message: null }),
}))
