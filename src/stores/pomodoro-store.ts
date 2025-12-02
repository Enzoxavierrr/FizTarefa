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
  lastTickTime: number
  
  // Actions
  start: () => void
  pause: () => void
  reset: () => void
  skip: () => void
  tick: () => void
  setCurrentTask: (taskId: string | null) => void
  completePhase: () => void
  syncTime: () => void // Sincroniza tempo após recarregar
}

export const usePomodoroStore = create<PomodoroStore>()(
  persist(
    (set, get) => ({
      phase: 'work',
      timeRemaining: POMODORO_DURATIONS.work,
      isRunning: false,
      cyclesCompleted: 0,
      currentTaskId: null,
      lastTickTime: Date.now(),

      start: () => set({ isRunning: true, lastTickTime: Date.now() }),
      
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
          set({ timeRemaining: timeRemaining - 1, lastTickTime: Date.now() })
        }
      },
      
      // Sincroniza o tempo após recarregar a página (calcula tempo passado)
      syncTime: () => {
        const { isRunning, lastTickTime, timeRemaining } = get()
        
        if (!isRunning || !lastTickTime) return
        
        const now = Date.now()
        const elapsedSeconds = Math.floor((now - lastTickTime) / 1000)
        
        if (elapsedSeconds > 0) {
          const newTimeRemaining = timeRemaining - elapsedSeconds
          
          if (newTimeRemaining <= 0) {
            // O timer teria terminado enquanto estava fechado
            get().completePhase()
          } else {
            set({ timeRemaining: newTimeRemaining, lastTickTime: now })
          }
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
        phase: state.phase,
        timeRemaining: state.timeRemaining,
        isRunning: state.isRunning,
        cyclesCompleted: state.cyclesCompleted,
        currentTaskId: state.currentTaskId,
        lastTickTime: Date.now(), // Salva quando foi o último tick
      }),
    }
  )
)

