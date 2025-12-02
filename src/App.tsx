import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { useAuth } from '@/hooks/use-auth'
import { isSupabaseConfigured } from '@/lib/supabase'
import { AuthPage } from '@/pages/auth'
import { SetupPage } from '@/pages/setup'
import {
  Sidebar,
  WelcomeHeader,
  StatsCard,
  StatisticsChart,
  RightPanel,
} from "@/components/dashboard"
import { SmoothCursor } from '@/components/ui/smooth-cursor'
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

  return (
    <div className="min-h-screen bg-background p-4 flex gap-6">
      <Sidebar />
      <main className="flex-1 flex flex-col gap-6">
        <WelcomeHeader userName={userName} />
        <div className="grid grid-cols-3 gap-4">
          <StatsCard value="0" label="Horas Trabalhadas" />
          <StatsCard value="0" label="Pomodoros" />
          <StatsCard value="0" label="Tarefas Feitas" />
        </div>
        <StatisticsChart />
      </main>
      <RightPanel />
    </div>
  )
}

function App() {
  if (!isSupabaseConfigured) {
    return (
      <div className="cursor-none">
        <SmoothCursor />
        <SetupPage />
        <Toaster position="bottom-right" richColors />
      </div>
    )
  }

  return (
    <div className="cursor-none">
      <SmoothCursor />
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster position="bottom-right" richColors />
      </BrowserRouter>
    </div>
  )
}

export default App
