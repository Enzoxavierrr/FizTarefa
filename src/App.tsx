import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { useAuth } from '@/hooks/use-auth'
import { useTasks } from '@/hooks/use-tasks'
import { usePomodoroStore } from '@/stores/pomodoro-store'
import { isSupabaseConfigured } from '@/lib/supabase'
import { AuthPage } from '@/pages/auth'
import { SetupPage } from '@/pages/setup'
import { CreateTaskPage } from '@/pages/create-task'
import { TasksPage } from '@/pages/tasks'
import { TimerPage } from '@/pages/timer'
import { CalendarPage } from '@/pages/calendar'
import { SettingsPage } from '@/pages/settings'
import {
  Sidebar,
  WelcomeHeader,
  StatsCard,
  StatisticsChart,
  RightPanel,
} from "@/components/dashboard"
import { SmoothCursor } from '@/components/ui/smooth-cursor'
import { PomodoroBackground } from '@/components/pomodoro/pomodoro-background'
import { Loader2 } from 'lucide-react'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  return <>{children}</>
}

function Dashboard() {
  const { getUserName } = useAuth()
  const userName = getUserName()
  const { tasks } = useTasks()
  const cyclesCompleted = usePomodoroStore((state) => state.cyclesCompleted)

  // Calcular estatísticas
  const completedTasks = tasks.filter(t => t.completed).length
  const totalPomodoros = tasks.reduce((sum, task) => sum + task.pomodoros_completed, 0) + cyclesCompleted
  const hoursWorked = Math.round((totalPomodoros * 25) / 60 * 10) / 10 // Cada pomodoro = 25min

  return (
    <div className="min-h-screen bg-background p-4 flex gap-6">
      <Sidebar />
      <main className="flex-1 flex flex-col gap-6">
        <WelcomeHeader userName={userName} />
        <div className="grid grid-cols-3 gap-4">
          <StatsCard value={hoursWorked.toString()} label="Horas Trabalhadas" />
          <StatsCard value={totalPomodoros.toString()} label="Pomodoros" />
          <StatsCard value={completedTasks.toString()} label="Tarefas Feitas" />
        </div>
        <StatisticsChart />
      </main>
      <RightPanel />
    </div>
  )
}

function App() {
  return (
    <div className="cursor-none">
      <SmoothCursor />
      <PomodoroBackground />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          {!isSupabaseConfigured && <Route path="/setup" element={<SetupPage />} />}
          <Route
            path="/"
            element={
              isSupabaseConfigured ? (
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              ) : (
                <Navigate to="/auth" replace />
              )
            }
          />
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <TasksPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks/new"
            element={
              <ProtectedRoute>
                <CreateTaskPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/timer"
            element={
              <ProtectedRoute>
                <TimerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <CalendarPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster position="bottom-right" richColors toastOptions={{ className: 'cursor-none' }} />
      </BrowserRouter>
    </div>
  )
}

export default App
