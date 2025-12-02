import { useEffect, useState } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session } }: any) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string, name?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || email.split('@')[0],
        },
      },
    })
    return { data, error }
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { data, error }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut({ scope: 'local' })
      // Limpa o estado local mesmo se houver erro
      setUser(null)
      setSession(null)
      return { error }
    } catch (err) {
      // Limpa o estado local em caso de exceção
      setUser(null)
      setSession(null)
      return { error: err as Error }
    }
  }

  // Pegar o nome do usuário dos metadados ou do email
  const getUserName = () => {
    if (!user) return 'Usuário'
    return user.user_metadata?.name || user.email?.split('@')[0] || 'Usuário'
  }

  // Deletar conta e todos os dados do usuário
  const deleteAccount = async () => {
    if (!user) {
      return { error: new Error('Usuário não autenticado') }
    }

    try {
      // 1. Deletar todas as tarefas do usuário
      const { error: tasksError } = await supabase
        .from('tasks')
        .delete()
        .eq('user_id', user.id)

      if (tasksError) {
        console.error('Erro ao deletar tarefas:', tasksError)
        return { error: tasksError }
      }

      // 2. Deletar todas as listas do usuário
      const { error: listsError } = await supabase
        .from('lists')
        .delete()
        .eq('user_id', user.id)

      if (listsError) {
        console.error('Erro ao deletar listas:', listsError)
        return { error: listsError }
      }

      // 3. Fazer logout (a conta do usuário no Supabase Auth não pode ser deletada
      // diretamente pelo cliente sem permissões de admin. Os dados foram deletados,
      // e o usuário pode solicitar a exclusão da conta através do painel do Supabase
      // ou podemos criar uma função edge para isso no futuro)
      await supabase.auth.signOut({ scope: 'local' })
      
      // Limpa o estado local
      setUser(null)
      setSession(null)

      return { error: null }
    } catch (err) {
      console.error('Erro ao deletar conta:', err)
      return { error: err as Error }
    }
  }

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    getUserName,
    deleteAccount,
  }
}
