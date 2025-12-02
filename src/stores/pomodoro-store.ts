import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PomodoroPhase } from '@/types'
import { POMODORO_DURATIONS } from '@/types'

interface PomodoroStore {
  phase: PomodoroPhase
  timeRemaining: number
  isRunning: boolean
  cyclesCompleted: number
  currentTaskId: string | null
  
  // Actions
  start: () => void
  pause: () => void
  reset: () => void
  skip: () => void
  tick: () => void
  setCurrentTask: (taskId: string | null) => void
  completePhase: () => void
}

export const usePomodoroStore = create<PomodoroStore>()(
  persist(
    (set, get) => ({
      phase: 'work',
      timeRemaining: POMODORO_DURATIONS.work,
      isRunning: false,
      cyclesCompleted: 0,
      currentTaskId: null,

      start: () => set({ isRunning: true }),
      
      pause: () => set({ isRunning: false }),
      
      reset: () => set({
        phase: 'work',
        timeRemaining: POMODORO_DURATIONS.work,
        isRunning: false,
      }),
      
      skip: () => {
        const { phase, cyclesCompleted } = get()
        
        if (phase === 'work') {
          const newCycles = cyclesCompleted + 1
          const isLongBreak = newCycles % 4 === 0
          
          set({
            phase: isLongBreak ? 'long-break' : 'short-break',
            timeRemaining: isLongBreak ? POMODORO_DURATIONS['long-break'] : POMODORO_DURATIONS['short-break'],
            cyclesCompleted: newCycles,
            isRunning: false,
          })
        } else {
          set({
            phase: 'work',
            timeRemaining: POMODORO_DURATIONS.work,
            isRunning: false,
          })
        }
      },
      
      tick: () => {
        const { timeRemaining, isRunning } = get()
        
        if (!isRunning) return
        
        if (timeRemaining <= 1) {
          get().completePhase()
        } else {
          set({ timeRemaining: timeRemaining - 1 })
        }
      },
      
      setCurrentTask: (taskId) => set({ currentTaskId: taskId }),
      
      completePhase: () => {
        const { phase, cyclesCompleted } = get()
        
        if (phase === 'work') {
          const newCycles = cyclesCompleted + 1
          const isLongBreak = newCycles % 4 === 0
          
          set({
            phase: isLongBreak ? 'long-break' : 'short-break',
            timeRemaining: isLongBreak ? POMODORO_DURATIONS['long-break'] : POMODORO_DURATIONS['short-break'],
            cyclesCompleted: newCycles,
            isRunning: false,
          })
        } else {
          set({
            phase: 'work',
            timeRemaining: POMODORO_DURATIONS.work,
            isRunning: false,
          })
        }
      },
    }),
    {
      name: 'pomodoro-storage',
      partialize: (state) => ({
        cyclesCompleted: state.cyclesCompleted,
        currentTaskId: state.currentTaskId,
      }),
    }
  )
)

