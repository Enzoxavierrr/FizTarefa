import { create } from 'zustand'

export interface GuestUser {
  id: string
  name: string
  email?: string
}

interface GuestStore {
  isGuestMode: boolean
  guestUser: GuestUser | null
  enableGuestMode: () => void
  disableGuestMode: () => void
}

export const useGuestStore = create<GuestStore>((set) => ({
  isGuestMode: false,
  guestUser: null,
  enableGuestMode: () => {
    const guestId = `guest-${Date.now()}`
    const guestUser: GuestUser = {
      id: guestId,
      name: 'Visitante',
      email: undefined,
    }
    set({ isGuestMode: true, guestUser })
  },
  disableGuestMode: () => {
    set({ isGuestMode: false, guestUser: null })
  },
}))

