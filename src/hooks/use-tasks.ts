import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useAuth } from './use-auth'
import type { Task } from '@/types'
import { toast } from 'sonner'

export function useTasks(listId?: string | null) {
  const { user } = useAuth()
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured || !user) {
      setTasks([])
      setLoading(false)
      return
    }

    fetchTasks()

    const channel = supabase
      .channel('tasks-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchTasks()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, listId])

  const fetchTasks = async () => {
    if (!user) return

    let query = supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('completed', { ascending: true })
      .order('created_at', { ascending: false })

    if (listId) {
      query = query.eq('list_id', listId)
    }

    const { data, error } = await query

    if (error) {
      toast.error('Erro ao carregar tarefas')
      console.error(error)
    } else {
      setTasks(data || [])
    }
    setLoading(false)
  }

  interface CreateTaskData {
    title: string
    description?: string
    list_id?: string | null
    difficulty?: number
    estimated_time?: number
    start_date?: string | null
    deadline?: string | null
  }

  const createTask = async (taskData: CreateTaskData | string, listId?: string | null) => {
    if (!user) return { error: new Error('Usuário não autenticado') }

    // Suporte para chamada antiga (apenas título) e nova (objeto completo)
    const insertData = typeof taskData === 'string' 
      ? {
          user_id: user.id,
          title: taskData,
          list_id: listId || null,
        }
      : {
          user_id: user.id,
          title: taskData.title,
          description: taskData.description || null,
          list_id: taskData.list_id || null,
          difficulty: taskData.difficulty ?? 25,
          estimated_time: taskData.estimated_time ?? 60,
          start_date: taskData.start_date || null,
          deadline: taskData.deadline || null,
        }

    const { data, error } = await (supabase as any)
      .from('tasks')
      .insert(insertData)
      .select()
      .single()

    if (error) {
      toast.error('Erro ao criar tarefa')
      console.error(error)
    } else {
      toast.success('Tarefa criada!')
    }

    return { data, error }
  }

  const updateTask = async (id: string, updates: Partial<Pick<Task, 'title' | 'description' | 'completed' | 'pomodoros_completed' | 'list_id' | 'scheduled_time' | 'start_date' | 'difficulty' | 'estimated_time'>>) => {
    // Optimistic update
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, ...updates } : task
      )
    )

    const { data, error } = await (supabase as any)
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      // Reverte em caso de erro
      fetchTasks()
      toast.error('Erro ao atualizar tarefa')
      console.error(error)
    } else {
      toast.success('Tarefa atualizada!')
    }

    return { data, error }
  }

  const scheduleTask = async (id: string, scheduledTime: number | null) => {
    // Optimistic update
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id ? { ...task, scheduled_time: scheduledTime } : task
      )
    )

    const { data, error } = await (supabase as any)
      .from('tasks')
      .update({ scheduled_time: scheduledTime })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      // Reverte se houver erro
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === id ? { ...task, scheduled_time: task.scheduled_time } : task
        )
      )
      toast.error('Erro ao agendar tarefa')
      console.error(error)
    }

    return { data, error }
  }

  const toggleTaskComplete = async (id: string, completed: boolean) => {
    // Optimistic update - atualiza a UI imediatamente
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id ? { ...task, completed } : task
      )
    )
    
    const result = await updateTask(id, { completed })
    
    // Se houver erro, reverte a mudança
    if (result.error) {
      setTasks(prevTasks => 
        prevTasks.map(task => 
          task.id === id ? { ...task, completed: !completed } : task
        )
      )
    }
    
    return result
  }

  const incrementPomodoros = async (id: string) => {
    const task = tasks.find((t) => t.id === id)
    if (!task) return { error: new Error('Tarefa não encontrada') }

    return updateTask(id, { pomodoros_completed: task.pomodoros_completed + 1 })
  }

  const deleteTask = async (id: string) => {
    // Optimistic update - remove a tarefa imediatamente da UI
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id))

    const { error } = await supabase.from('tasks').delete().eq('id', id)

    if (error) {
      // Reverte em caso de erro - recarrega as tarefas
      fetchTasks()
      toast.error('Erro ao excluir tarefa')
      console.error(error)
    } else {
      toast.success('Tarefa excluída!')
    }

    return { error }
  }

  const getTaskById = (id: string) => {
    return tasks.find((task) => task.id === id)
  }

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    toggleTaskComplete,
    incrementPomodoros,
    deleteTask,
    getTaskById,
    scheduleTask,
    refetch: fetchTasks,
  }
}

