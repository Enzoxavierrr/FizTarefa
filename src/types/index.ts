export interface User {
  id: string
  email: string
}

export interface List {
  id: string
  user_id: string
  name: string
  color: string | null
  created_at: string
}

export interface Task {
  id: string
  user_id: string
  list_id: string | null
  title: string
  description: string | null
  completed: boolean
  pomodoros_completed: number
  difficulty: number
  estimated_time: number
  start_date: string | null
  deadline: string | null
  scheduled_time: number | null // Hora do dia agendada (0-23)
  created_at: string
}

export type PomodoroPhase = 'work' | 'short-break' | 'long-break'

export interface PomodoroState {
  phase: PomodoroPhase
  timeRemaining: number
  isRunning: boolean
  cyclesCompleted: number
  currentTaskId: string | null
}

export const POMODORO_DURATIONS = {
  work: 25 * 60,
  'short-break': 5 * 60,
  'long-break': 15 * 60,
} as const

export const LIST_COLORS = [
  '#ef4444', // red
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#14b8a6', // teal
  '#3b82f6', // blue
  '#8b5cf6', // violet
  '#ec4899', // pink
] as const

