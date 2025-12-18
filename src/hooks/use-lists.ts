import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { useAuth } from './use-auth'
import { useGuestStore } from '@/stores/guest-store'
import type { List } from '@/types'
import { toast } from 'sonner'

export function useLists() {
  const { user, isGuestMode } = useAuth()
  const { guestUser } = useGuestStore()
  const [lists, setLists] = useState<List[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Modo guest: apenas inicializa com array vazio
    if (isGuestMode) {
      setLists([])
      setLoading(false)
      return
    }

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
  }, [user, isGuestMode])

  const fetchLists = async () => {
    if (!user) return

    // Modo guest: não precisa buscar do Supabase
    if (isGuestMode) {
      setLists(lists)
      setLoading(false)
      return
    }

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

    // Modo guest: criar lista apenas em memória
    if (isGuestMode && guestUser) {
      const newList: List = {
        id: `list-${Date.now()}-${Math.random()}`,
        user_id: guestUser.id,
        name,
        color,
        created_at: new Date().toISOString(),
      }

      setLists(prevLists => [...prevLists, newList])
      toast.success('Lista criada!')
      return { data: newList, error: null }
    }

    // Modo normal: usar Supabase
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
    // Optimistic update
    const updatedList = lists.find(l => l.id === id)
    setLists(prevLists =>
      prevLists.map(list =>
        list.id === id ? { ...list, ...updates } : list
      )
    )

    // Modo guest: apenas atualizar em memória
    if (isGuestMode) {
      toast.success('Lista atualizada!')
      return { data: updatedList ? { ...updatedList, ...updates } : null, error: null }
    }

    // Modo normal: usar Supabase
    const { data, error } = await (supabase as any)
      .from('lists')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      // Reverte em caso de erro
      fetchLists()
      toast.error('Erro ao atualizar lista')
      console.error(error)
    } else {
      toast.success('Lista atualizada!')
    }

    return { data, error }
  }

  const deleteList = async (id: string) => {
    // Optimistic update - remove a lista imediatamente da UI
    setLists(prevLists => prevLists.filter(list => list.id !== id))

    // Modo guest: apenas remover da memória
    if (isGuestMode) {
      toast.success('Lista excluída!')
      return { error: null }
    }

    // Modo normal: usar Supabase
    const { error } = await supabase.from('lists').delete().eq('id', id)

    if (error) {
      // Reverte em caso de erro - recarrega as listas
      fetchLists()
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

