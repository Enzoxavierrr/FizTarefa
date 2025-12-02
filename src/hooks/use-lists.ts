import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useAuth } from './use-auth'
import type { List } from '@/types'
import { toast } from 'sonner'

export function useLists() {
  const { user } = useAuth()
  const [lists, setLists] = useState<List[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured || !user) {
      setLists([])
      setLoading(false)
      return
    }

    fetchLists()

    const channel = supabase
      .channel('lists-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'lists',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          fetchLists()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user])

  const fetchLists = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from('lists')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    if (error) {
      toast.error('Erro ao carregar listas')
      console.error(error)
    } else {
      setLists(data || [])
    }
    setLoading(false)
  }

  const createList = async (name: string, color: string) => {
    if (!user) return { error: new Error('Usuário não autenticado') }

    const { data, error } = await (supabase as any)
      .from('lists')
      .insert({
        user_id: user.id,
        name,
        color,
      })
      .select()
      .single()

    if (error) {
      toast.error('Erro ao criar lista')
      console.error(error)
    } else {
      toast.success('Lista criada!')
    }

    return { data, error }
  }

  const updateList = async (id: string, updates: Partial<Pick<List, 'name' | 'color'>>) => {
    const { data, error } = await (supabase as any)
      .from('lists')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      toast.error('Erro ao atualizar lista')
      console.error(error)
    } else {
      toast.success('Lista atualizada!')
    }

    return { data, error }
  }

  const deleteList = async (id: string) => {
    const { error } = await supabase.from('lists').delete().eq('id', id)

    if (error) {
      toast.error('Erro ao excluir lista')
      console.error(error)
    } else {
      toast.success('Lista excluída!')
    }

    return { error }
  }

  const getListById = (id: string) => {
    return lists.find((list) => list.id === id)
  }

  return {
    lists,
    loading,
    createList,
    updateList,
    deleteList,
    getListById,
    refetch: fetchLists,
  }
}

