import { useState } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui'
import { TaskCard } from './task-card'
import { TaskDialog } from './task-dialog'
import { useTasks } from '@/hooks/use-tasks'
import type { Task } from '@/types'

interface TaskListProps {
  listId?: string | null
  title: string
  color?: string | null
}

export function TaskList({ listId, title, color }: TaskListProps) {
  const { tasks, loading } = useTasks(listId)
  const [taskDialogOpen, setTaskDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>()

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
    setTaskDialogOpen(true)
  }

  const handleCloseDialog = (open: boolean) => {
    setTaskDialogOpen(open)
    if (!open) {
      setEditingTask(undefined)
    }
  }

  const incompleteTasks = tasks.filter((t) => !t.completed)
  const completedTasks = tasks.filter((t) => t.completed)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {color && (
            <div
              className="h-4 w-4 rounded-full"
              style={{ backgroundColor: color }}
            />
          )}
          <h1 className="text-2xl font-bold">{title}</h1>
          <span className="text-sm text-muted-foreground">
            ({incompleteTasks.length} pendente{incompleteTasks.length !== 1 ? 's' : ''})
          </span>
        </div>
        <Button onClick={() => setTaskDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          Nova tarefa
        </Button>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            Nenhuma tarefa ainda. Que tal criar uma?
          </p>
          <Button onClick={() => setTaskDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            Criar primeira tarefa
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {incompleteTasks.length > 0 && (
            <div className="space-y-2">
              {incompleteTasks.map((task) => (
                <TaskCard key={task.id} task={task} onEdit={handleEditTask} />
              ))}
            </div>
          )}

          {completedTasks.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                Concluídas ({completedTasks.length})
              </h3>
              {completedTasks.map((task) => (
                <TaskCard key={task.id} task={task} onEdit={handleEditTask} />
              ))}
            </div>
          )}
        </div>
      )}

      <TaskDialog
        open={taskDialogOpen}
        onOpenChange={handleCloseDialog}
        task={editingTask}
        listId={listId}
      />
    </div>
  )
}

