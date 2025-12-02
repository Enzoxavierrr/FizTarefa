import { useParams, Navigate } from 'react-router-dom'
import { TaskList } from '@/components/tasks/task-list'
import { useLists } from '@/hooks/use-lists'
import { Loader2 } from 'lucide-react'

export function ListPage() {
  const { listId } = useParams<{ listId: string }>()
  const { lists, loading, getListById } = useLists()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  const list = listId ? getListById(listId) : null

  if (!list && lists.length > 0) {
    return <Navigate to="/" replace />
  }

  if (!list) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Lista não encontrada</p>
      </div>
    )
  }

  return <TaskList listId={list.id} title={list.name} color={list.color} />
}

