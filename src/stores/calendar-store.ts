import { create } from 'zustand'

interface CalendarStore {
  selectedDate: Date | null
  setSelectedDate: (date: Date | null) => void
}

export const useCalendarStore = create<CalendarStore>((set) => ({
  selectedDate: new Date(), // Por padrão, hoje
  setSelectedDate: (date) => set({ selectedDate: date }),
}))

