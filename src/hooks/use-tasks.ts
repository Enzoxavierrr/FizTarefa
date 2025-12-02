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

  const createTask = async (title: string, listId?: string | null) => {
    if (!user) return { error: new Error('Usuário não autenticado') }

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        user_id: user.id,
        title,
        list_id: listId || null,
      })
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

  const updateTask = async (id: string, updates: Partial<Pick<Task, 'title' | 'description' | 'completed' | 'pomodoros_completed' | 'list_id'>>) => {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      toast.error('Erro ao atualizar tarefa')
      console.error(error)
    }

    return { data, error }
  }

  const toggleTaskComplete = async (id: string, completed: boolean) => {
    return updateTask(id, { completed })
  }

  const incrementPomodoros = async (id: string) => {
    const task = tasks.find((t) => t.id === id)
    if (!task) return { error: new Error('Tarefa não encontrada') }

    return updateTask(id, { pomodoros_completed: task.pomodoros_completed + 1 })
  }

  const deleteTask = async (id: string) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id)

    if (error) {
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
    refetch: fetchTasks,
  }
}

