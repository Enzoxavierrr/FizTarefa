import { useEffect, useRef } from 'react'
import { usePomodoroStore } from '@/stores/pomodoro-store'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { toast } from 'sonner'

/**
 * Componente invisível que mantém o timer do Pomodoro rodando em background
 * Deve ser montado no nível do App para funcionar em todas as páginas
 */
export function PomodoroBackground() {
  // Pegar apenas os valores, não as funções (para evitar re-renders)
  const isRunning = usePomodoroStore((state) => state.isRunning)
  const phase = usePomodoroStore((state) => state.phase)
  const currentTaskId = usePomodoroStore((state) => state.currentTaskId)
  const cyclesCompleted = usePomodoroStore((state) => state.cyclesCompleted)
  
  const prevPhaseRef = useRef(phase)
  const prevCyclesRef = useRef(cyclesCompleted)
  const hasInitialized = useRef(false)

  // Sincroniza o tempo quando o componente monta (após recarregar página)
  useEffect(() => {
    if (!hasInitialized.current) {
      usePomodoroStore.getState().syncTime()
      hasInitialized.current = true
    }
  }, [])

  // Timer tick - roda sempre que isRunning for true
  useEffect(() => {
    console.log('[PomodoroBackground] isRunning changed:', isRunning)
    
    if (!isRunning) return

    console.log('[PomodoroBackground] Starting interval')
    const interval = setInterval(() => {
      const state = usePomodoroStore.getState()
      console.log('[PomodoroBackground] tick - timeRemaining:', state.timeRemaining)
      state.tick()
    }, 1000)

    return () => {
      console.log('[PomodoroBackground] Clearing interval')
      clearInterval(interval)
    }
  }, [isRunning])

  // Detecta mudança de fase e mostra notificação
  useEffect(() => {
    if (prevPhaseRef.current !== phase) {
      const wasWork = prevPhaseRef.current === 'work'
      
      // Incrementa pomodoros da tarefa quando completa um ciclo de trabalho
      if (wasWork && currentTaskId && isSupabaseConfigured) {
        incrementTaskPomodoros(currentTaskId)
      }

      // Mostra notificação
      if (wasWork) {
        const isLongBreak = phase === 'long-break'
        toast.success(
          isLongBreak
            ? '🎉 Pausa longa! Você completou 4 ciclos!'
            : '☕ Hora da pausa! Descanse um pouco.',
          { duration: 5000 }
        )
        
        // Notificação do navegador
        showBrowserNotification(
          isLongBreak ? 'Pausa Longa!' : 'Hora da Pausa!',
          isLongBreak 
            ? 'Você completou 4 ciclos! Descanse bem.' 
            : 'Descanse um pouco antes do próximo foco.'
        )
      } else {
        toast.info('💪 Hora de focar! Vamos trabalhar.', { duration: 5000 })
        showBrowserNotification('Hora de Focar!', 'Vamos voltar ao trabalho.')
      }

      prevPhaseRef.current = phase
    }
  }, [phase, currentTaskId])

  // Atualiza ref de ciclos
  useEffect(() => {
    prevCyclesRef.current = cyclesCompleted
  }, [cyclesCompleted])

  // Pede permissão para notificações do navegador
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  return null // Componente invisível
}

// Função para incrementar pomodoros da tarefa no banco
async function incrementTaskPomodoros(taskId: string) {
  try {
    // Primeiro busca o valor atual
    const { data: task } = await (supabase as any)
      .from('tasks')
      .select('pomodoros_completed')
      .eq('id', taskId)
      .single()

    if (task) {
      await (supabase as any)
        .from('tasks')
        .update({ pomodoros_completed: (task.pomodoros_completed || 0) + 1 })
        .eq('id', taskId)
    }
  } catch (error) {
    console.error('Erro ao incrementar pomodoros:', error)
  }
}

// Função para mostrar notificação do navegador
function showBrowserNotification(title: string, body: string) {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/logo.png',
      badge: '/logo.png',
    })
  }
}

